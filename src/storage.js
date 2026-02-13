const RUN_SAVE_KEY = 'stcb.run.v1.2';
const HALL_OF_FAME_KEY = 'stcb.hof.v1.2';

const replacer = (_, value) => {
  if (value instanceof Set) {
    return { __type: 'Set', values: [...value] };
  }
  return value;
};

const reviver = (_, value) => {
  if (value && value.__type === 'Set') {
    return new Set(value.values || []);
  }
  return value;
};

export function hasSavedRun() {
  try {
    return Boolean(localStorage.getItem(RUN_SAVE_KEY));
  } catch {
    return false;
  }
}

export function saveRunSnapshot(snapshot) {
  try {
    localStorage.setItem(RUN_SAVE_KEY, JSON.stringify(snapshot, replacer));
    return true;
  } catch {
    return false;
  }
}

export function loadRunSnapshot() {
  try {
    const raw = localStorage.getItem(RUN_SAVE_KEY);
    if (!raw) return null;
    return JSON.parse(raw, reviver);
  } catch {
    return null;
  }
}

export function clearRunSnapshot() {
  try {
    localStorage.removeItem(RUN_SAVE_KEY);
  } catch {
    // noop
  }
}

export function loadHallOfFame() {
  try {
    const raw = localStorage.getItem(HALL_OF_FAME_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function addHallOfFameRecord(record) {
  const current = loadHallOfFame();
  current.unshift(record);
  const limited = current.slice(0, 30);
  try {
    localStorage.setItem(HALL_OF_FAME_KEY, JSON.stringify(limited));
  } catch {
    // noop
  }
}

export function clearHallOfFame() {
  try {
    localStorage.removeItem(HALL_OF_FAME_KEY);
  } catch {
    // noop
  }
}
