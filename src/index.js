require('dotenv').config()
const cors = require('cors')
const express = require('express')
const Controllers = require('./app/controllers/GlobalController')
const schedule = require('node-schedule')
const updateCurrencies = require('./app/plugins/updateCurrencies')
const Currency = require('./app/models/Currency')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

Controllers(app);

app.get('/', (req, res) => {
    res.send('OK')
})

const appPort = process.env.PORT || 3001
app.listen(appPort, async () => {
    console.log('Server running on port', appPort)
    const currencyCountDocs = await Currency.countDocuments()
    if (currencyCountDocs < 1) {
        await updateCurrencies()
    }
    schedule.scheduleJob({minute: 0}, async function () {
        await updateCurrencies()
    })
})
