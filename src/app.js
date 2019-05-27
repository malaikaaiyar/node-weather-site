const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const path = require('path')
const express = require('express')
const hbs = require('hbs')

const app = express()
const port = process.env.PORT || 3000

// path variables for express configuration
const publicDirPath = path.join(__dirname, '../public')
const viewPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// set handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

// setup static directory to serve
app.use(express.static(publicDirPath))

app.get('', (req, res) => {
	res.render('index', {
		title: 'weather',
		name: 'Malaika'
	})
})

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'about',
		name: 'Malaika'
	})
})

app.get('/help', (req, res) => {
	res.render('help', {
		helpmessage: 'Help message printing.',
		title: 'help',
		name: 'Malaika'
	})
})

app.get('/weather', (req, res) => {
	if (!req.query.address) {
		return res.send({
			error: 'You must provide an address.'
		})
	} 

	geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
		if (error) {
			return res.send({ error })
		}

		forecast(latitude, longitude, (error, forecastData) => {
			if (error) {
				return res.send({ error })
			}
			res.send({	
				location: location,
				forecast: forecastData,
				address: req.query.address				})
			})
	})
				
})

app.get('/products', (req, res) => {
	if (!req.query.search) {
		return res.send({
			error: 'You must provide a search term.'
		})
	}

	console.log(req.query.search)
	res.send({
		products: []
	})
})

app.get('/help/*', (req,res) => {
	res.render('404', {
		title: '404',
		name: 'Malaika',
		errormessage: 'Help article not found.'
	})
})

app.get('*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'Malaika',
		errormessage: 'Page not found.'
	})
})

app.listen(port, () => {
	console.log('Server is up on port ' + port)
})