function createRotationDemo() {
  let attendance;
  let assignments;
  const reset = () => {
    attendance = { a: 'available', b: 'available', c: 'reserve' };
    assignments = ['', ''];
  };
  reset();
  return {
    reset,
    setAttendance(id, status) {
      if (!Object.hasOwn(attendance, id) || !['available', 'reserve', 'absent'].includes(status)) return false;
      attendance[id] = status;
      if (status === 'absent') assignments = assignments.map(person => person === id ? '' : person);
      return true;
    },
    assign(slot, id) {
      if (!Number.isInteger(slot) || slot < 0 || slot > 1) return false;
      if (id && (!Object.hasOwn(attendance, id) || attendance[id] === 'absent' || assignments.some((person, i) => i !== slot && person === id))) return false;
      assignments[slot] = id;
      return true;
    },
    suggest() {
      // This fixture illustrates availability, not the original scheduling engine.
      const candidates = ['available', 'reserve'].flatMap(status => Object.keys(attendance).filter(id => attendance[id] === status));
      assignments = [candidates[0] || '', candidates[1] || ''];
    },
    snapshot() {
      return {
        attendance: { ...attendance }, assignments: [...assignments],
        filled: assignments.filter(Boolean).length,
        reserveCount: assignments.filter(id => attendance[id] === 'reserve').length
      };
    }
  };
}
function createTabDemo() {
  let links, sequence;
  const reset = () => {
    sequence = 3;
    links = [
      { id: 1, name: '研究メモ', url: 'https://example.invalid/research' },
      { id: 2, name: '日程調整', url: 'https://example.invalid/schedule' },
      { id: 3, name: '就活ノート', url: 'https://example.invalid/jobs' }
    ];
  };
  reset();
  const snapshot = () => links.map(link => ({ ...link }));
  return {
    reset, snapshot,
    search(query) { return snapshot().filter(link => `${link.name} ${link.url}`.toLowerCase().includes(query.trim().toLowerCase())); },
    add(name, url) {
      if (!name.trim() || name.length > 40 || links.length >= 8) return false;
      let parsed;
      try { parsed = new URL(url); } catch { return false; }
      if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) return false;
      links.push({ id: ++sequence, name: name.trim(), url: parsed.href });
      return true;
    },
    remove(id) {
      const index = links.findIndex(link => link.id === id);
      if (index < 0) return false;
      links.splice(index, 1); return true;
    },
    move(id, delta) {
      const index = links.findIndex(link => link.id === id), target = index + delta;
      if (![-1, 1].includes(delta) || index < 0 || target < 0 || target >= links.length) return false;
      [links[index], links[target]] = [links[target], links[index]]; return true;
    }
  };
}

function createActionDemo() {
  let steps, selected;
  const kinds = ['wait', 'move', 'click'];
  const step = kind => ({ kind, ms: 500, x: 50, y: 50 });
  const reset = () => { steps = [step('wait'), { ...step('move'), x: 60, y: 40 }, step('click')]; selected = 1; };
  reset();
  return {
    reset,
    snapshot() { return { steps: steps.map(s => ({ ...s })), selected }; },
    select(index) { if (Number.isInteger(index) && steps[index]) { selected = index; return true; } return false; },
    update(values) {
      if (!steps[selected]) return false;
      if (values.kind !== undefined && !kinds.includes(values.kind)) return false;
      for (const key of ['ms', 'x', 'y']) if (values[key] !== undefined && (!Number.isInteger(values[key]) || values[key] < 0 || values[key] > (key === 'ms' ? 5000 : 100))) return false;
      for (const key of ['kind', 'ms', 'x', 'y']) if (values[key] !== undefined) steps[selected][key] = values[key];
      return true;
    },
    add(kind) { if (!kinds.includes(kind) || steps.length >= 8) return false; steps.push(step(kind)); selected = steps.length - 1; return true; },
    duplicate() { if (!steps[selected] || steps.length >= 8) return false; steps.splice(selected + 1, 0, { ...steps[selected] }); selected++; return true; },
    remove() { if (!steps[selected]) return false; steps.splice(selected, 1); selected = Math.max(0, Math.min(selected, steps.length - 1)); return true; },
    move(delta) { const target = selected + delta; if (![-1, 1].includes(delta) || !steps[target]) return false; [steps[selected], steps[target]] = [steps[target], steps[selected]]; selected = target; return true; },
    preview() {
      let pointer = { x: 50, y: 50 }, clicked = false;
      const logs = steps.map((s, i) => {
        if (s.kind === 'move') pointer = { x: s.x, y: s.y };
        if (s.kind === 'click') clicked = true;
        return `${i + 1}. ${s.kind === 'wait' ? `待機 ${s.ms} ms（このデモでは省略）` : s.kind === 'move' ? `デモ内の位置を (${s.x}%, ${s.y}%) に変更` : 'デモ内でクリックの印を表示'}`;
      });
      return { pointer, clicked, logs };
    }
  };
}

function createSurveyDemo() {
  let members, selected;
  const reset = () => {
    members = [
      { id: 'a', name: '学生 A', available: [true, true, false, true, false, true] },
      { id: 'b', name: '学生 B', available: [true, false, true, true, false, false] },
      { id: 'c', name: '学生 C', available: [true, false, true, false, true, true] },
      { id: 'd', name: '学生 D', available: null }
    ]; selected = new Set(['a', 'b', 'c']);
  };
  reset();
  return {
    reset,
    select(id, checked) { if (!members.some(m => m.id === id)) return false; if (checked) selected.add(id); else selected.delete(id); return true; },
    toggleCell(id, slot) {
      const member = members.find(m => m.id === id);
      if (!member?.available || !Number.isInteger(slot) || slot < 0 || slot > 5) return false;
      member.available[slot] = !member.available[slot]; return true;
    },
    snapshot() {
      const targets = members.filter(m => selected.has(m.id));
      const counts = Array.from({ length: 6 }, (_, i) => targets.filter(m => m.available?.[i]).length);
      return { members: members.map(m => ({ ...m, available: m.available ? [...m.available] : null })), selected: [...selected], counts, common: targets.length ? counts.flatMap((count, i) => count === targets.length ? [i] : []) : [] };
    }
  };
}

function createCompanionDemo() {
  let state;
  const reset = () => { state = { offset: 0, message: '', reply: 'こんにちは。これは定型応答のデモです。' }; };
  reset();
  return {
    reset, snapshot() { return { ...state }; },
    send(message) {
      if (!message.trim() || message.length > 120) return false;
      state.message = message.trim();
      state.reply = /予定/.test(message) ? 'デモの予定は、15:00に研究メモの整理です。' : /こんにちは|おはよう/.test(message) ? 'こんにちは。今日はどんなものを作りましょうか。' : 'メッセージを受け取りました。ここでは用意した文章で会話の流れを試せます。';
      return true;
    },
    touch() { state.reply = '触れてくれてありがとう。クリックへの反応も、ここで試せます。'; },
    move(direction) { if ([-1, 1].includes(direction)) state.offset = Math.max(-36, Math.min(36, state.offset + direction * 12)); }
  };
}
if (typeof module !== 'undefined' && module.exports) module.exports = { createRotationDemo, createTabDemo, createActionDemo, createSurveyDemo, createCompanionDemo };

(() => {
  if (typeof document === 'undefined') return;
  if (window.lucide) window.lucide.createIcons();
  const $ = selector => document.querySelector(selector);
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const menu = $('[data-menu]');
  const nav = $('.site-header nav');
  nav.id = 'site-nav';
  menu.setAttribute('aria-controls', nav.id);
  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}" aria-hidden="true"></i>`;
    window.lucide?.createIcons();
    // The nav precedes the button in the DOM, so move focus into the opened menu.
    if (open) nav.querySelector('a').focus();
  }
  menu.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('click', event => {
    // composedPath() is fixed at dispatch, so it still includes the button after its icon is re-rendered.
    const path = event.composedPath();
    if (nav.classList.contains('is-open') && !path.includes(nav) && !path.includes(menu)) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (nav.classList.contains('is-open')) { setMenu(false); menu.focus(); }
  });
  document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => window.print()));
  const toast = $('[data-toast]');
  const showToast = message => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('is-visible');
    window.setTimeout(() => toast.classList.remove('is-visible'), 2200);
  };
  const share = $('[data-share]');
  share?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast('ページのリンクをコピーしました');
    } catch {
      showToast('リンクをコピーできませんでした');
    }
  });
  const quickLinks = [...document.querySelectorAll('[data-quick-link]')];
  const indexToggle = $('[data-index-toggle]');
  const caseIndex = indexToggle?.closest('.case-index');
  const setIndexOpen = open => {
    if (!indexToggle) return;
    caseIndex.classList.toggle('index-open', open);
    indexToggle.setAttribute('aria-expanded', String(open));
    indexToggle.setAttribute('aria-label', open ? '目次を閉じる' : '目次を開く');
  };
  indexToggle?.addEventListener('click', () => setIndexOpen(indexToggle.getAttribute('aria-expanded') !== 'true'));
  caseIndex?.addEventListener('click', event => { if (event.target.closest('a')) setIndexOpen(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && indexToggle?.getAttribute('aria-expanded') === 'true') { setIndexOpen(false); indexToggle.focus(); }
  });
  const sectionTargets = quickLinks.map(link => ({ link, target: document.getElementById(link.dataset.quickLink) })).filter(item => item.target);
  const setActiveSection = id => quickLinks.forEach(link => {
    const active = link.dataset.quickLink === id;
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  if (sectionTargets.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.id);
    }, { rootMargin: '-18% 0px -62% 0px', threshold: [0, .2, .6] });
    sectionTargets.forEach(({ target }) => observer.observe(target));
  } else if (sectionTargets.length) setActiveSection(sectionTargets[0].target.id);
  const topButton = $('[data-top]');
  const firstSection = sectionTargets[0]?.target;
  const updateTop = () => {
    topButton?.toggleAttribute('hidden', window.scrollY < 420);
    // Above the first section nothing should stay highlighted.
    if (firstSection && firstSection.getBoundingClientRect().top > window.innerHeight * .4) setActiveSection(null);
  };
  window.addEventListener('scroll', updateTop, { passive: true });
  updateTop();
  const progress = $('[data-read-progress]');
  const updateReadProgress = () => {
    if (!progress) return;
    const range = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0;
    progress.style.transform = `scaleX(${fraction})`;
    progress.parentElement.setAttribute('aria-valuenow', String(Math.round(fraction * 100)));
  };
  if (progress) {
    window.addEventListener('scroll', updateReadProgress, { passive: true });
    window.addEventListener('resize', updateReadProgress);
    window.addEventListener('load', updateReadProgress);
    updateReadProgress();
  }
  topButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' }));
  const rotationDemo = $('[data-rotation-demo]');
  if (rotationDemo) {
    const model = createRotationDemo();
    const inputs = [...rotationDemo.querySelectorAll('[data-demo-attendance]')];
    const selects = [...rotationDemo.querySelectorAll('[data-demo-assignment]')];
    const status = rotationDemo.querySelector('[data-demo-status]');
    const render = message => {
      const state = model.snapshot();
      inputs.forEach(input => { input.checked = state.attendance[input.dataset.demoAttendance] === input.value; });
      selects.forEach((select, slot) => {
        select.value = state.assignments[slot];
        [...select.options].forEach(option => {
          option.disabled = Boolean(option.value) && (state.attendance[option.value] === 'absent' || state.assignments.some((id, i) => i !== slot && id === option.value));
        });
        rotationDemo.querySelector(`[data-demo-slot-note="${slot}"]`).textContent = !select.value ? '担当を選んでください' : state.attendance[select.value] === 'reserve' ? '人数不足の場合に担当できる先生です' : '出席予定の先生を割り当てています';
      });
      rotationDemo.querySelector('[data-demo-count]').textContent = `${state.filled} / 2`;
      status.dataset.state = state.filled < 2 ? 'pending' : state.reserveCount ? 'reserve' : 'ready';
      status.textContent = `${message ? message + ' ' : ''}${state.filled < 2 ? `あと${2 - state.filled}クラスの担当が未定です。` : state.reserveCount ? '2クラスの担当が揃いました。△の先生の予定も確認が必要です。' : '2クラスの担当が揃いました。'}`;
    };
    inputs.forEach(input => input.addEventListener('change', () => {
      model.setAttendance(input.dataset.demoAttendance, input.value);
      render('出席予定を変更しました。');
    }));
    selects.forEach((select, slot) => select.addEventListener('change', () => {
      model.assign(slot, select.value);
      render('担当表を更新しました。');
    }));
    rotationDemo.querySelector('[data-demo-suggest]').addEventListener('click', () => {
      model.suggest(); render('現在の出席予定から担当案を入れました。');
    });
    rotationDemo.querySelector('[data-demo-reset]').addEventListener('click', () => {
      model.reset(); render('最初の状態に戻しました。');
    });
    render();
  }
  const projectDemo = $('[data-project-demo]');
  if (projectDemo) {
    const find = selector => projectDemo.querySelector(selector);
    const feedback = message => { find('[data-project-demo-status]').textContent = message; };
    const node = (tag, text, className) => {
      const element = document.createElement(tag);
      if (text !== undefined) element.textContent = text;
      if (className) element.className = className;
      return element;
    };
    const iconButton = (symbol, label) => {
      const button = node('button', undefined, 'icon-button');
      button.setAttribute('aria-label', label); button.title = label;
      const icon = node('i'); icon.dataset.lucide = symbol; icon.setAttribute('aria-hidden', 'true');
      button.append(icon); return button;
    };
    let reset;
    if (projectDemo.dataset.projectDemo === 'custom-tab') {
      const model = createTabDemo();
      const render = () => {
        const active = document.activeElement, focusId = active?.dataset.tabAction ? active.id : null;
        const all = model.snapshot(), links = model.search(find('[data-tab-search]').value);
        find('[data-tab-total]').textContent = `${all.length}件`;
        find('[data-tab-links]').replaceChildren(...links.map(link => {
          const item = node('div', undefined, 'tab-shortcut');
          const text = node('div'); text.append(node('strong', link.name), node('small', link.url));
          const tools = node('div', undefined, 'tab-shortcut-tools');
          for (const [action, symbol, label, disabled] of [['left', 'arrow-left', `${link.name}を前へ`, all[0].id === link.id], ['right', 'arrow-right', `${link.name}を後ろへ`, all.at(-1).id === link.id], ['remove', 'trash-2', `${link.name}を削除`, false]]) {
            const button = iconButton(symbol, label); button.id = `tab-${link.id}-${action}`; button.dataset.tabAction = action; button.dataset.tabId = link.id; button.disabled = disabled; tools.append(button);
          }
          item.append(text, tools); return item;
        }));
        if (!links.length) find('[data-tab-links]').append(node('p', '該当するリンクはありません。'));
        window.lucide?.createIcons();
        if (focusId) {
          const target = document.getElementById(focusId);
          (target && !target.disabled ? target : target?.parentElement.querySelector('button:not(:disabled)') || find('[data-tab-search]')).focus({ preventScroll: true });
        }
      };
      find('[data-tab-search]').addEventListener('input', render);
      find('[data-tab-add]').addEventListener('click', () => {
        const added = model.add(find('[data-tab-name]').value, find('[data-tab-url]').value);
        if (added) find('[data-tab-search]').value = '';
        render(); feedback(added ? 'リンクを追加しました。このページの外へは移動しません。' : '名前と http / https のURLを確認してください。追加は8件までです。');
      });
      find('[data-tab-links]').addEventListener('click', event => {
        const button = event.target.closest('[data-tab-action]'); if (!button) return;
        const id = Number(button.dataset.tabId), action = button.dataset.tabAction;
        if (action === 'remove') model.remove(id); else model.move(id, action === 'left' ? -1 : 1);
        render(); feedback(action === 'remove' ? 'リンクを削除しました。' : 'リンクの並びを変更しました。');
      });
      find('[data-tab-wallpaper]').addEventListener('click', event => {
        const button = event.currentTarget, visible = button.getAttribute('aria-pressed') !== 'true';
        button.setAttribute('aria-pressed', String(visible)); find('[data-tab-art]').hidden = !visible;
      });
      reset = () => { model.reset(); find('[data-tab-search]').value = ''; find('[data-tab-name]').value = '授業ノート'; find('[data-tab-url]').value = 'https://example.invalid/class'; find('[data-tab-art]').hidden = false; find('[data-tab-wallpaper]').setAttribute('aria-pressed', 'true'); render(); feedback('デモ用のリンク3件を表示しています。'); };
    } else if (projectDemo.dataset.projectDemo === 'visionauto') {
      const model = createActionDemo();
      const label = step => step.kind === 'wait' ? `待機 ${step.ms} ms` : step.kind === 'move' ? `移動 (${step.x}%, ${step.y}%)` : 'クリック';
      const render = (updateFields = true) => {
        const state = model.snapshot(), focusId = document.activeElement?.dataset.actionSelect !== undefined ? document.activeElement.id : null;
        find('[data-action-list]').replaceChildren(...state.steps.map((step, i) => {
          const button = node('button', `${String(i + 1).padStart(2, '0')}. ${label(step)}`);
          button.id = `action-step-${i}`; button.dataset.actionSelect = i; button.setAttribute('aria-pressed', String(i === state.selected)); return button;
        }));
        if (!state.steps.length) find('[data-action-list]').append(node('p', '操作はまだありません。'));
        const selected = state.steps[state.selected];
        if (updateFields) projectDemo.querySelectorAll('[data-action-field]').forEach(input => { input.disabled = !selected; input.value = selected ? selected[input.dataset.actionField] : input.dataset.actionField === 'kind' ? 'wait' : ''; });
        find('[data-action-wait]').hidden = selected?.kind !== 'wait';
        find('[data-action-coordinates]').hidden = selected?.kind !== 'move';
        find('[data-action-duplicate]').disabled = !selected || state.steps.length >= 8;
        find('[data-action-add]').disabled = state.steps.length >= 8;
        find('[data-action-remove]').disabled = !selected;
        find('[data-action-move="-1"]').disabled = !selected || state.selected === 0;
        find('[data-action-move="1"]').disabled = !selected || state.selected === state.steps.length - 1;
        find('[data-action-log]').replaceChildren();
        const pointer = find('[data-action-pointer]'); pointer.style.left = '50%'; pointer.style.top = '50%'; pointer.classList.remove('clicked');
        if (focusId) document.getElementById(focusId)?.focus({ preventScroll: true });
      };
      find('[data-action-list]').addEventListener('click', event => {
        const button = event.target.closest('[data-action-select]'); if (!button) return;
        model.select(Number(button.dataset.actionSelect)); render(); feedback('編集する操作を切り替えました。');
      });
      projectDemo.querySelectorAll('[data-action-field]').forEach(input => input.addEventListener(input.type === 'number' ? 'input' : 'change', () => {
        const key = input.dataset.actionField, value = key === 'kind' ? input.value : Number(input.value);
        const valid = input.value !== '' && model.update({ [key]: value });
        render(input.type !== 'number');
        feedback(valid ? '操作を変更しました。プレビューは未実行です。' : '指定できる範囲の整数を入力してください。');
      }));
      for (const [selector, action] of [['[data-action-add]', () => model.add('click')], ['[data-action-duplicate]', () => model.duplicate()], ['[data-action-remove]', () => model.remove()]]) find(selector).addEventListener('click', () => { action(); render(); feedback('操作列を更新しました。'); });
      projectDemo.querySelectorAll('[data-action-move]').forEach(button => button.addEventListener('click', () => { model.move(Number(button.dataset.actionMove)); render(); feedback('操作の順序を変更しました。'); }));
      find('[data-action-run]').addEventListener('click', () => {
        const invalid = [...projectDemo.querySelectorAll('.action-editor input')].find(input => !input.disabled && !input.closest('[hidden]') && (!input.value || !input.validity.valid || !Number.isInteger(Number(input.value))));
        if (invalid) { invalid.focus(); feedback('指定できる範囲の整数を入力してから、もう一度確認してください。'); return; }
        const result = model.preview();
        const pointer = find('[data-action-pointer]'); pointer.style.left = `${result.pointer.x}%`; pointer.style.top = `${result.pointer.y}%`; pointer.classList.toggle('clicked', result.clicked);
        find('[data-action-log]').replaceChildren(...result.logs.map(text => node('li', text)));
        feedback(result.logs.length ? `${result.logs.length}個の操作をデモ内で確認しました。実際のPCには入力していません。` : '確認する操作がありません。');
      });
      reset = () => { model.reset(); render(); feedback('待機・移動・クリックの3操作を表示しています。'); };
    } else if (projectDemo.dataset.projectDemo === 'lab-survey') {
      const model = createSurveyDemo(), slots = ['月1限','月2限','火1限','火2限','水1限','水2限'];
      const render = () => {
        const state = model.snapshot(), focusId = document.activeElement?.id;
        find('[data-survey-members]').replaceChildren(...state.members.map(member => {
          const label = node('label'); const input = node('input'); input.type = 'checkbox'; input.id = `survey-member-${member.id}`; input.dataset.surveyMember = member.id; input.checked = state.selected.includes(member.id);
          label.append(input, node('span', `${member.name}${member.available ? '' : '（未回答）'}`)); return label;
        }));
        find('[data-survey-rows]').replaceChildren(...state.members.filter(m => state.selected.includes(m.id)).map(member => {
          const row = node('tr'), heading = node('th', member.name); heading.scope = 'row'; row.append(heading);
          slots.forEach((slot, i) => {
            const cell = node('td');
            if (!member.available) cell.textContent = '—';
            else {
              const input = node('input'); input.type = 'checkbox'; input.id = `survey-${member.id}-${i}`; input.dataset.surveyCell = `${member.id}:${i}`; input.checked = member.available[i]; input.setAttribute('aria-label', `${member.name} ${slot}`); cell.append(input); cell.dataset.available = String(input.checked);
            }
            row.append(cell);
          }); return row;
        }));
        find('[data-survey-common]').replaceChildren(...state.common.map(i => node('span', slots[i])));
        if (!state.common.length) find('[data-survey-common]').textContent = state.selected.length ? '全員が空いている時間はありません。' : '対象者が選択されていません。';
        find('[data-survey-heatmap]').replaceChildren(...state.counts.map((count, i) => {
          const cell = node('div'); cell.append(node('span', slots[i]), node('strong', `${count} / ${state.selected.length}`)); cell.style.backgroundColor = ['#f1f4f8','#e0eaf2','#c9dce8','#acc8da','#90b6cc'][count]; return cell;
        }));
        if (focusId) document.getElementById(focusId)?.focus({ preventScroll: true });
        feedback(`対象${state.selected.length}名。全員が空いている時間は${state.common.length}枠です。`);
      };
      projectDemo.addEventListener('change', event => {
        const input = event.target;
        if (input.dataset.surveyMember) model.select(input.dataset.surveyMember, input.checked);
        else if (input.dataset.surveyCell) { const [id, slot] = input.dataset.surveyCell.split(':'); model.toggleCell(id, Number(slot)); }
        else return;
        render();
      });
      const setView = view => {
        find('[data-survey-analysis]').hidden = view !== 'analysis'; find('[data-survey-unanswered]').hidden = view !== 'unanswered';
        projectDemo.querySelectorAll('[data-survey-view]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.surveyView === view)));
      };
      projectDemo.querySelectorAll('[data-survey-view]').forEach(button => button.addEventListener('click', () => { setView(button.dataset.surveyView); feedback(button.dataset.surveyView === 'unanswered' ? '学生 D は未回答です。回答済みの人と分けて扱います。' : '架空の回答を集計しています。'); }));
      reset = () => { model.reset(); setView('analysis'); render(); };
    } else if (projectDemo.dataset.projectDemo === 'desktop-companion') {
      const model = createCompanionDemo();
      const render = () => {
        const state = model.snapshot(); find('.pet-character').style.transform = `translateX(${state.offset}px)`; find('[data-pet-reply]').textContent = state.reply;
      };
      const send = () => {
        const sent = model.send(find('[data-pet-message]').value);
        render(); feedback(sent ? '用意した文章で応答しました。AIや音声サービスには接続していません。' : '1文字から120文字で入力してください。');
      };
      find('[data-pet-send]').addEventListener('click', send);
      find('[data-pet-message]').addEventListener('keydown', event => { if (event.key === 'Enter' && !event.isComposing) { event.preventDefault(); send(); } });
      find('[data-pet-example]').addEventListener('click', () => { find('[data-pet-message]').value = '今日の予定を教えて'; send(); });
      projectDemo.querySelectorAll('[data-pet-touch]').forEach(button => button.addEventListener('click', () => { model.touch(); render(); feedback('クリックへの反応を表示しました。立ち絵は静止画像です。'); }));
      projectDemo.querySelectorAll('[data-pet-move]').forEach(button => button.addEventListener('click', () => { model.move(Number(button.dataset.petMove)); render(); feedback('デモ内で表示位置を変更しました。'); }));
      reset = () => { model.reset(); find('[data-pet-message]').value = ''; render(); feedback('定型応答の会話デモです。'); };
    }
    if (reset) { find('[data-project-demo-reset]').addEventListener('click', reset); reset(); }
  }
  const slides = [...document.querySelectorAll('[data-feature-slide]')];
  document.querySelectorAll('[data-story-gallery]').forEach(gallery => {
    const tabs = [...gallery.querySelectorAll('[role="tab"]')];
    const selectTab = (index, focus = false) => tabs.forEach((tab, i) => {
      const selected = i === index;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
      if (selected && focus) tab.focus();
    });
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => selectTab(index));
      tab.addEventListener('keydown', event => {
        const target = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index + tabs.length - 1) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : -1;
        if (target < 0) return;
        event.preventDefault();
        selectTab(target, true);
      });
    });
  });
  if (slides.length > 1) {
    let active = 0;
    const status = $('[data-feature-status]');
    function showSlide(delta) {
      active = (active + delta + slides.length) % slides.length;
      slides.forEach((slide, index) => { slide.hidden = index !== active; });
      const title = document.createElement('span');
      title.className = 'sr-only';
      title.textContent = ` ${slides[active].querySelector('figcaption a').textContent}`;
      status.replaceChildren(`${active + 1} / ${slides.length}`, title);
    }
    $('[data-feature-prev]').addEventListener('click', () => showSlide(-1));
    $('[data-feature-next]').addEventListener('click', () => showSlide(1));
  }
  const dialog = $('#visual-dialog');
  const visualContent = $('#visual-content');
  const zoomButton = $('[data-zoom]');
  let activeExpand;
  function setZoom(zoomed) {
    visualContent.classList.toggle('is-zoomed', zoomed);
    zoomButton.setAttribute('aria-pressed', String(zoomed));
    const label = zoomed ? '全体を表示' : '原寸で表示';
    zoomButton.setAttribute('aria-label', label);
    zoomButton.title = label;
    zoomButton.innerHTML = `<i data-lucide="${zoomed ? 'zoom-out' : 'zoom-in'}" aria-hidden="true"></i>`;
    window.lucide?.createIcons();
    visualContent.scrollTop = 0;
    visualContent.scrollLeft = 0;
  }
  document.querySelectorAll('[data-expand]').forEach(expand => expand.addEventListener('click', () => {
    const showcase = expand.closest('.project-showcase');
    activeExpand = expand;
    const fullFrame = showcase.querySelector('.screenshot-frame').cloneNode(true);
    fullFrame.classList.remove('screen-detail', 'story-frame', 'compact-screen');
    fullFrame.removeAttribute('style');
    fullFrame.querySelector('img').removeAttribute('style');
    fullFrame.querySelectorAll('.screen-marker, [data-expand]').forEach(control => control.remove());
    visualContent.replaceChildren(fullFrame);
    $('#visual-title').textContent = $('h1').textContent;
    const caption = showcase.querySelector('figcaption').cloneNode(true);
    caption.querySelector('.crop-note')?.remove();
    const sourceNote = showcase.querySelector('.screen-detail') ? 'この詳細に使った元の実画面です。' : '';
    $('#visual-caption').textContent = sourceNote + caption.textContent;
    setZoom(false);
    dialog.showModal();
  }));
  // The screenshot itself is also a target for opening the larger view.
  document.querySelectorAll('.project-showcase .screenshot-frame').forEach(frame => frame.addEventListener('click', event => {
    if (event.target.closest('a, button')) return;
    frame.closest('.project-showcase').querySelector('[data-expand]').click();
  }));
  zoomButton.addEventListener('click', () => setZoom(zoomButton.getAttribute('aria-pressed') !== 'true'));
  $('[data-close]').addEventListener('click', () => dialog.close());
  // Only a click on the backdrop closes; clicks in the dialog's own padding also target the dialog.
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => activeExpand?.focus());
})();
