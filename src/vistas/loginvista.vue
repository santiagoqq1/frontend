<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/almacenes/autenticacion'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const cargando = ref(false)

const iniciarSesion = async () => {
  if (!email.value || !password.value) {
    authStore.error = 'El correo y la contraseña son obligatorios'
    return
  }

  cargando.value = true

  const correcto = await authStore.login({
    email: email.value,
    password: password.value,
  })

  cargando.value = false

  if (correcto) {
    router.push('/panel')
  }
}
</script>

<template>
  <main class="pagina-login">
    <section class="tarjeta-login">
      <h1>Auth Service</h1>
      <p>Inicio de sesión</p>

      <form @submit.prevent="iniciarSesion">
        <label>Correo</label>
        <input v-model="email" type="email" placeholder="santiago@correo.com" />

        <label>Contraseña</label>
        <input v-model="password" type="password" placeholder="santiago1234" />

        <button type="submit" :disabled="cargando">
          {{ cargando ? 'Ingresando...' : 'Ingresar' }}
        </button>
      </form>

      <div v-if="authStore.error" class="error">
        {{ authStore.error }}
      </div>
    </section>
  </main>
</template>

<style scoped>
.pagina-login {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f6f8;
}

.tarjeta-login {
  width: 380px;
  padding: 32px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

h1 {
  margin-bottom: 4px;
}

p {
  margin-bottom: 24px;
  color: #555;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

button {
  margin-top: 12px;
  padding: 12px;
  border: none;
  background: #2563eb;
  color: white;
  border-radius: 8px;
  cursor: pointer;
}

button:disabled {
  background: #94a3b8;
}

.error {
  margin-top: 16px;
  color: #b91c1c;
  background: #fee2e2;
  padding: 10px;
  border-radius: 8px;
}
</style>