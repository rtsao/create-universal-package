import test from 'tape-cup';

import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
configure({adapter: new Adapter()});

import React from 'react';

import {Component} from '../index.node.js';

test('a node only test', t => {
  t.pass('node only assertion');
  t.end();
});

test('shallow render', t => {
  const wrapper = shallow(<Component />);
  t.ok(wrapper);
  t.end();
});
