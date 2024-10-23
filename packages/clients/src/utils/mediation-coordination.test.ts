import { describe, expect, test } from "@jest/globals";
import Mediation_Coordinaton from "./mediation-coordination";

describe('resolver module', () => {
    test('test did peer resolver', () => {
      expect(
         Mediation_Coordinaton(false, [], "", "add")
      ).toBe("");
    });
  });
  
  