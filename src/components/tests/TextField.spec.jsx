import { screen } from '@testing-library/react';
import React from 'react';

import TextField from '@/components/TextField';
import render from '@/utils/test/render';

//my-class라는 class가 항상 적용된 컴포넌트 렌더링
// beforeEach(async () => {
//   await render(<TextField className="my-class" />);
// });

it('className prop으로 설정한 css class가 적용된다', async () => {
  //1. className을 가진 컴포넌트 렌더링
  //2. 클릭이나 메서드를 호출해 prop변경 등등.. (생략)
  //3. 렌더링 후 DOM에 해당 class가 존재하는지 확인

  //1. className을 가진 컴포넌트 렌더링
  await render(<TextField className="my-class" />);

  //3. 렌더링 후 DOM에 해당 class가 존재하는지 확인
  screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  //expect 함수를 통해 기대 결과를 검증
  //toHaveClass는 매처로, 해당 엘리먼트가 특정 클래스를 가지고 있는지 확인
  expect(screen.getByPlaceholderText('텍스트를 입력해 주세요.')).toHaveClass(
    'my-class',
  );

  //frontEnd test는 classname이란 내부 props나 state를 테스트하는 것이 아니라
  //렌더링되는 DOM 구조가 올바르게 변경되었는지 확인한다 -> 최종적으로 사용자에게 보여지는 DOM
});

describe('placeholder', () => {
  //it: 검증하고자 하는 대상의 최종 결과 상태를 예상하여 정의
  // 기대 결과 === 실제 결과 => 테스트 성공
  it('기본 placeholder "텍스트를 입력해 주세요." 가 노출된다.', async () => {
    await render(<TextField />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    //단언(assertion) -> 테스트가 통과하기 위한 조건 -> 검증 실행
    //검증 실행에 사용되는 도구를 매처(matcher)라고 한다.
    //하지만 vitest에는 DOM에 접근하는 매처가 없기 때문에 jest-dom라이브러리를 설치하여 사용한다.
    //toBeInTheDocument: 해당 엘리먼트가 DOM에 존재하는지 확인 을 단언 할 수 있는거임
    expect(textInput).toBeInTheDocument();
  });

  it('placeholder prop에 따라 placeholder가 변경된다.', async () => {
    await render(<TextField placeholder={'placeholder 변경'} />);

    const textInput = screen.getByPlaceholderText('placeholder 변경');

    expect(textInput).toBeInTheDocument();
  });
});

it('텍스트를 입력하면 onChange prop으로 등록된 함수가 호출된다', async () => {
  //스파이 함수: 테스트 코드에서 특정 합수가 호출되었는지, 함수의 인자로 어떤 것이 넘어왔는지 어떤 값을 반환하는지 등을 확인할 수 있는 함수
  //보통 콜백함수나 이벤트 핸들러들이 호출되었는지 확인할 때 사용
  const spy = vi.fn();

  const { user } = await render(<TextField onChange={spy} />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  await user.type(textInput, 'test');

  expect(spy).toHaveBeenCalledWith('test');
});

it('텍스트를 입력하면 onEnter prop으로 등록된 함수가 호출된다', async () => {
  const spy = vi.fn();

  const { user } = await render(<TextField onEnter={spy} />);

  const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

  await user.type(textInput, 'test{Enter}'); // 키입력

  expect(spy).toHaveBeenCalledWith('test');
});

describe('focus', () => {
  it('포커스가 활성화되면 onFocus prop으로 등록한 함수가 호출된다.', async () => {
    //포커스 활성화 방법
    //탭 키로 인풋 요소로 포커스 이동
    //인풋 요소를 클릭 (가장 보편적)
    //textInput.focus() 메서드를 호출

    const spy = vi.fn();

    const { user } = await render(<TextField onFocus={spy} />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    await user.click(textInput);

    expect(spy).toHaveBeenCalled(); //focus에는 인자가 없으니까 toHaveBeenCalled()로 호출 여부만 확인
  });

  it('포커스가 활성화되면 border 스타일이 추가된다.', async () => {
    //포커스 활성화 방법
    //탭 키로 인풋 요소로 포커스 이동
    //인풋 요소를 클릭 (가장 보편적)
    //textInput.focus() 메서드를 호출

    const { user } = await render(<TextField />);

    const textInput = screen.getByPlaceholderText('텍스트를 입력해 주세요.');

    await user.click(textInput);

    //toHaveStyle: 해당 엘리먼트의 스타일을 검증하는 매처
    expect(textInput).toHaveStyle({
      borderWidth: 2,
      borderColor: 'rgb(25, 118, 210)',
    });
  });
});
