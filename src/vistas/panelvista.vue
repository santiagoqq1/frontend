<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { piecesApi } from '@/servicios/api'
import { useAuthStore } from '@/almacenes/autenticacion'

const router = useRouter()
const authStore = useAuthStore()

const proyectos = ref([])
const bloques = ref([])
const piezas = ref([])

const proyectoSeleccionado = ref('')
const bloqueSeleccionado = ref('')
const piezaSeleccionada = ref('')
const pesoReal = ref('')

const mensaje = ref('')
const error = ref('')

const piezaSeleccionadaDatos = computed(() => {
  return piezas.value.find((pieza) => pieza.id === Number(piezaSeleccionada.value))
})

const diferenciaPeso = computed(() => {
  if (!piezaSeleccionadaDatos.value || pesoReal.value === '') return ''

  return Number(pesoReal.value) - Number(piezaSeleccionadaDatos.value.theoretical_weight)
})

const cargarProyectos = async () => {
  const respuesta = await piecesApi.get('/projects')
  proyectos.value = respuesta.data.data
}

const cargarBloques = async () => {
  proyectoSeleccionado.value = Number(proyectoSeleccionado.value)
  bloqueSeleccionado.value = ''
  piezaSeleccionada.value = ''
  bloques.value = []
  piezas.value = []

  if (!proyectoSeleccionado.value) return

  const respuesta = await piecesApi.get(`/blocks?project_id=${proyectoSeleccionado.value}`)
  bloques.value = respuesta.data.data
}

const cargarPiezas = async () => {
  bloqueSeleccionado.value = Number(bloqueSeleccionado.value)
  piezaSeleccionada.value = ''
  piezas.value = []

  if (!bloqueSeleccionado.value) return

  const respuesta = await piecesApi.get(
  `/pieces?block_id=${bloqueSeleccionado.value}&status=Pendiente`
)
  piezas.value = respuesta.data.data
}

const registrarFabricacion = async () => {
  mensaje.value = ''
  error.value = ''

  if (
    !proyectoSeleccionado.value ||
    !bloqueSeleccionado.value ||
    !piezaSeleccionada.value ||
    pesoReal.value === ''
  ) {
    error.value = 'Todos los campos son obligatorios'
    return
  }

  if (isNaN(pesoReal.value) || Number(pesoReal.value) < 0) {
    error.value = 'El peso real debe ser numérico y mayor o igual a cero'
    return
  }

  try {
    await piecesApi.post('/fabrication-records', {
      piece_id: piezaSeleccionada.value,
      real_weight: pesoReal.value,
    })

    mensaje.value = 'Registro de fabricación guardado correctamente'
    pesoReal.value = ''
    await cargarPiezas()
  } catch (err) {
    error.value = err.response?.data?.message || 'Error al registrar fabricación'
  }
}

const cerrarSesion = async () => {
  await authStore.logout()
  router.push('/')
}

onMounted(() => {
  cargarProyectos()
})
</script>

<template>
  <main class="panel">
    <header class="encabezado">
      <div>
        <h1>Registro de fabricación</h1>
        <p>Usuario: {{ authStore.usuario?.name }}</p>
      </div>

      <button class="cerrar-sesion" @click="cerrarSesion">Cerrar sesión</button>
    </header>

    <section class="tarjeta">
      <h2>Formulario principal</h2>

      <div class="grilla-formulario">
        <div>
          <label>Proyecto</label>
          <select v-model="proyectoSeleccionado" @change="cargarBloques">
            <option value="">Seleccione un proyecto</option>
            <option v-for="proyecto in proyectos" :key="proyecto.id" :value="proyecto.id">
              {{ proyecto.name }}
            </option>
          </select>
        </div>

        <div>
          <label>Bloque</label>
          <select v-model="bloqueSeleccionado" @change="cargarPiezas" :disabled="!proyectoSeleccionado">
            <option value="">Seleccione un bloque</option>
            <option v-for="bloque in bloques" :key="bloque.id" :value="bloque.id">
              {{ bloque.name }}
            </option>
          </select>
        </div>

        <div>
          <label>Pieza</label>
          <select v-model="piezaSeleccionada" :disabled="!bloqueSeleccionado">
            <option value="">Seleccione una pieza</option>
            <option v-for="pieza in piezas" :key="pieza.id" :value="pieza.id">
              {{ pieza.name }} - {{ pieza.status }}
            </option>
          </select>
        </div>

        <div>
          <label>Peso teórico</label>
          <input
            type="text"
            disabled
            :value="piezaSeleccionadaDatos ? piezaSeleccionadaDatos.theoretical_weight : ''"
          />
        </div>

        <div>
          <label>Peso real</label>
          <input v-model="pesoReal" type="number" step="0.01" placeholder="Ej: 118.75" />
        </div>

        <div>
          <label>Diferencia de peso</label>
          <input type="text" disabled :value="diferenciaPeso" />
        </div>
      </div>

      <button class="principal" @click="registrarFabricacion">
        Registrar fabricación
      </button>

      <div v-if="mensaje" class="exito">{{ mensaje }}</div>
      <div v-if="error" class="error">{{ error }}</div>
    </section>
  </main>
</template>

<style scoped>
.panel {
  min-height: 100vh;
  background: #f4f6f8;
  padding: 32px;
}

.encabezado {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.encabezado h1 {
  margin-bottom: 4px;
}

.encabezado p {
  color: #555;
}

.tarjeta {
  background: white;
  padding: 28px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.07);
}

h2 {
  margin-bottom: 20px;
}

.grilla-formulario {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

select,
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
}

.principal {
  margin-top: 24px;
  padding: 12px 18px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}

.cerrar-sesion {
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  background: #dc2626;
  color: white;
  cursor: pointer;
}

.exito {
  margin-top: 16px;
  padding: 12px;
  background: #dcfce7;
  color: #166534;
  border-radius: 8px;
}

.error {
  margin-top: 16px;
  padding: 12px;
  background: #fee2e2;
  color: #991b1b;
  border-radius: 8px;
}

@media (max-width: 900px) {
  .grilla-formulario {
    grid-template-columns: 1fr;
  }

  .encabezado {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>