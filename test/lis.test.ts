import { lis } from '../lib/renderer'

test("lis", () => {
  expect(lis([])).toEqual([])

  expect(lis([1])).toEqual([0])

  expect(lis([1, 5, 3, 7])).toEqual([0, 1, 3])
  
  expect(lis([1, 0, 2, 4])).toEqual([1, 2, 3])

  expect(lis([3, 2, 1])).toEqual([])
})