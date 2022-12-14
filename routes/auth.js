const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const issueToken = require('../utils/jwt')
const { User } = require('../models/index')

app.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({
    where: {
      email
    }
  })

  if (!user) {
    res.status(404).send('Not found')
  } else {
    const validPassword = await bcrypt.compare(password, user.password)

    if (validPassword) {
      const token = issueToken({ id: user.id, email: user.email })

      res.json({
        token
      })
    } else {
      res.status(404).send('Not found')
    }
  }
})

app.post('/signup', async (req, res) => {
  const { email, password, firstName, lastName } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await User.create({
    email,
    password: hashedPassword,
    firstName,
    lastName
  })

  res.json(user)
})

module.exports = app
