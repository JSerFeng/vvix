import {scheduleRun} from '../lib/scheduler'

test("should be called only once", () => {
  return new Promise(resolve => {
    const run = jest.fn(() => {
      expect(run).toHaveBeenCalledTimes(1)
      setTimeout(resolve)
    })
    scheduleRun(run)
    scheduleRun(run)
    scheduleRun(run)
  })
})