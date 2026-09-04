import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import getDb from '../config/database.js'
import dotenv from 'dotenv'

dotenv.config()

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body
    const db = await getDb()

    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email])
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const result = await db.run(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    )
    const user = await db.get('SELECT id, name, email FROM users WHERE id = ?', [result.lastID])

    res.status(201).json({ 
      message: 'User created successfully', 
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const db = await getDb()

    const user = await db.get('SELECT * FROM users WHERE email = ?', [email])
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}