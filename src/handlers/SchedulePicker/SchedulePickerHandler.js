const config = require('./config.json')
const BaseHandler = require('./../BaseHandler')
const ScheduleNotFoundException = require('./../../exceptions/ScheduleNotFoundException')
const ScheduleFinder = require('./helpers/ScheduleFinder')

class SchedulePickerHandler extends BaseHandler {
  constructor(requestDate) {
    super()

    this.scheduleParams = config.scheduleParams
    this.sportCourtsParams = config.sportCourtsParams
    this.bookingParams = {...config.bookingParams, requestDate}
  }

  async execute(page) {
    const sportCourtsParams = this.sportCourtsParams
    const scheduleParams = this.scheduleParams
    const bookingParams = this.bookingParams

    /**
     * Picked Schedule JSHandle
     * @type {JSHandle}
     */
    console.log('... at ', bookingParams.requestDate, ' for ' + bookingParams.period/(1000*60) + ' minutes ...')
    const scheduleFinder = new ScheduleFinder(page, sportCourtsParams, scheduleParams, bookingParams)
    const pickedScheduleHandle = await scheduleFinder.find()
    if (null === pickedScheduleHandle) {
      throw new ScheduleNotFoundException('No schedule available ! Stop...')
    } else {
      console.log('Found schedule !...')
      await pickedScheduleHandle.click()
      await page.waitForNavigation()
    }
  }
}

module.exports = SchedulePickerHandler