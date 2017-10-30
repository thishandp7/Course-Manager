import React from 'react';
import {mount, shallow} from 'enzyme';
import expect from 'expect';
import {authersFormattedForDropdown} from './selector';

describe('Author Selectors', () => {
  describe('authersFormattedForDropdown', () => {
      it("should return author data formatted for use in a dropdown", () =>{
          const author = [
            {id: "cory-house", firstName: "Cory", lastName: "House"},
            {id: "scott-allen", firstName: "Scott", lastName: "Allen"}
          ];

          const expectedAuthor = [
            {value: "cory-house", text: "Cory House"},
            {value: "scott-allen", text: "Scott Allen"}
          ];

          expect(authersFormattedForDropdown(author)).toEqual(expectedAuthor);
      });
  });
});
