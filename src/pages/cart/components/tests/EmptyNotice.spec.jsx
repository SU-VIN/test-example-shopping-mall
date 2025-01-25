import { screen } from '@testing-library/react';
import React from 'react';

import EmptyNotice from '@/pages/cart/components/EmptyNotice';
import render from '@/utils/test/render';

const navigateFn = vi.fn(); //스파이 함수

vi.mock('react-router-dom', async () => {
  // react-router-dom을 모킹함.
  // useNavigate 훅으로 반환받은 navigate 함수가 올바르게 호출되는가 -> 스파이 함수

  const original = await vi.importActual('react-router-dom');

  return { ...original, useNavigate: () => navigateFn };
});

it('"홈으로 가기" 링크를 클릭할경우 "/"경로로 navigate함수가 호출된다', async () => {
  //1. notice 컴포넌트를 렌더링한다.
  //2. 홈으로 가기 링크를 클릭한다.
  //3. navigate 함수가 호출되는지 확인한다.

  const { user } = await render(<EmptyNotice />);
  await user.click(screen.getByText('홈으로 가기')); //클릭 api
  expect(navigateFn).toHaveBeenNthCalledWith(1, '/'); // 루트 패스로 1번만 호출되는지 검증
});
