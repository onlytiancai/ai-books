class Auth {
  constructor() {
    this.currentUser = null
  }

  async init() {
    await this.checkAuth()
  }

  async checkAuth() {
    try {
      const res = await fetch('/api/auth/me')
      const data = await res.json()
      this.currentUser = data.user
    } catch (err) {
      console.error('Auth check error:', err)
      this.currentUser = null
    }
  }

  async login(username, password) {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }
      this.currentUser = data.user
      return { success: true, user: data.user }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  async register(username, password, passwordHint) {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, passwordHint })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }
      this.currentUser = data.user
      return { success: true, user: data.user }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  async logout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      this.currentUser = null
      return { success: true }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  showLogin() {
    // Dispatch custom event for modal to listen
    window.dispatchEvent(new CustomEvent('show-login-modal'))
  }

  showRegister() {
    window.dispatchEvent(new CustomEvent('show-register-modal'))
  }
}

export default Auth
