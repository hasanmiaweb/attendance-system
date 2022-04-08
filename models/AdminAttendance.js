const {Schema, model} = require('mongoose')

const adminAttendanceSchema = new Schema({
    timeLimit: Number,
    status: String,
    createAt: Date
})

const AdminAttendance = model('adminAttendance', adminAttendanceSchema)
module.exports = AdminAttendance