import React from 'react';
import {UserList} from './userlist';
import {Chat} from './chat';
import {Input} from './input';

export class View extends React.Component {
  render() {
    return (
      <div>
      <UserList /><Chat /><Input />
      </div>
    );
  }
};
