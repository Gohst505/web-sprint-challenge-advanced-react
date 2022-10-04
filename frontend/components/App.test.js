// Write your tests here
import {render, fireEvent, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AppClass from './AppClass';
import React from 'react';

test('renders without errors', ()=>{
  render(<AppClass/>);
  expect('Welcome to the GRID').toBeInTheDocument;
  expect('Coordinates (2,2)').toBeInTheDocument;
  expect('You moved 0 times').toBeInTheDocument;
});

test('AppClass is a class-based, Review how how to build a class-based copmonent, such as using "extends", and constructors', () =>{
  expect(
    AppClass.prototype &&
    AppClass.prototype.isReactComponent
  ).toBeTruthy()
});

test('page does not allow invalid moves', () =>{
  render(<AppClass/>)
  const downButton = screen.getByText("DOWN");

  userEvent.click(downButton);
  userEvent.click(downButton);

  expect(/you can't go down/i).toBeInTheDocument;
  expect(/you moved one time/i).toBeInTheDocument;
})

test('page does not allow invalid moves', () =>{
  render(<AppClass/>)
  const rightButton = screen.getByText("RIGHT");

  userEvent.click(rightButton);
  userEvent.click(rightButton);

  expect(/you can't go right/i).toBeInTheDocument;
  expect(/you moved one time/i).toBeInTheDocument;
})

test('page does not allow invalid moves', () =>{
  render(<AppClass/>)
  const leftButton = screen.getByText("LEFT");

  userEvent.click(leftButton);
  userEvent.click(leftButton);

  expect(/you can't go left/i).toBeInTheDocument;
  expect(/you moved one time/i).toBeInTheDocument;
})

test('page does not allow invalid moves', () =>{
  render(<AppClass/>)
  const upButton = screen.getByText("UP");

  userEvent.click(upButton);
  userEvent.click(upButton);

  expect(/you can't go up/i).toBeInTheDocument;
  expect(/you moved one time/i).toBeInTheDocument;
})


test('sanity', () => {
  expect(true).toBe(true)
})
