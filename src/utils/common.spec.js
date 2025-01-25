import { vi } from 'node_modules/vitest/dist/index';

import { pick, debounce } from './common';

describe('pick util 단위테스트', () => {
  it('단일 인자로 전달된 키의 값을 객체에 담아 반환한다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj, 'a')).toEqual({ a: 'A' });
  });

  it('2개 이상의 인자로 전달된 키의 값을 객체에 담아 반환한다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj, 'a', 'b')).toEqual({ a: 'A', b: { c: 'C' } });
  });

  it('대상 객체로 아무 것도 전달 하지 않을 경우 빈 객체가 반환된다', () => {
    expect(pick()).toEqual({});
  });

  it('propNames를 지정하지 않을 경우 빈 객체가 반환된다', () => {
    const obj = {
      a: 'A',
      b: { c: 'C' },
      d: null,
    };

    expect(pick(obj)).toEqual({});
  });
});

// 테스트 코드는 비동기 타이머와 무관하게 동기적으로 실행
// -> 비동기 함수가 실행되기 전에 단언이 실행됨
// 타이머 모킹!!

describe('debounce util 단위테스트', () => {
  // 타이머 모킹 함수 -> 0.3초 흐른것으로 타이머 조작 -> spy 함수 호출 확인
  beforeEach(() => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date('2025-01-20')); //특별한 날을 고정 할 수 있음
  });

  afterEach(() => {
    // 타이머 초기화
    vi.useRealTimers();
  });

  it('특정 시간이 지난 후 함수가 호출된다.', () => {
    // 디바운스 함수의 테스트를 위해선 콜백 함수를 하나 넘겨 특정 시간이 지났을 때 호출되어야한다.
    // 함수의 호출 여부를 확인하기 위해 spy함수 사용

    const spy = vi.fn();

    const debouncedFn = debounce(spy, 300); //콜백을 첫번째 인자로, 타이머 시간을 두번째 인자로

    debouncedFn(); //함수 호출

    vi.advanceTimersByTime(300); //300ms 시간이 흐름

    expect(spy).toHaveBeenCalled(); //함수가 호출되었는지 확인
  });

  it('연이어 호출해도 마지막 호출 기준으로 지정된 타이머 시간이 지난 경우에만 함수가 호출된다.', () => {
    const spy = vi.fn();

    const debouncedFn = debounce(spy, 300);

    debouncedFn(); //최초 호출

    vi.advanceTimersByTime(200); //200ms 시간이 흐름
    debouncedFn(); //함수 호출

    vi.advanceTimersByTime(100); //100ms 시간이 흐름
    debouncedFn(); //함수 호출

    vi.advanceTimersByTime(200); //200ms 시간이 흐름
    debouncedFn(); //함수 호출

    vi.advanceTimersByTime(300); //300ms 시간이 흐름
    debouncedFn(); //함수 호출

    //5번이 호출 되었지만, 0.3초가 지난 마지막 호출만 실행되어야함
    expect(spy).toHaveBeenCalledTimes(1); //함수가 한번만 호출되었는
  });
});
