import test from 'tape-cup';

import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});

import React from 'react';

import {Component} from '../index.browser.js';

test('a browser only test', t => {
  t.pass('browser only assertion');
  t.end();
});

test('full dom render', t => {
  const wrapper = mount(<Component />);
  t.ok(wrapper);
  t.end();
});
