// Datos de tareas
const tasksData = [
  {
    id: 1,
    title: "Definir arquitectura del sistema",
    description: "Establecer la estructura base del ERP y sus módulos principales",
    status: "completada",
    assignee: "Sebastián",
    phase: 1,
  },
  {
    id: 2,
    title: "Crear wireframes iniciales",
    description: "Diseñar los primeros bocetos de las interfaces principales",
    status: "completada",
    assignee: "Ariadna",
    phase: 1,
  },
  {
    id: 3,
    title: "Investigar tecnologías frontend",
    description: "Evaluar frameworks y herramientas para el desarrollo",
    status: "en-progreso",
    assignee: "José Camilo",
    phase: 1,
  },
  {
    id: 4,
    title: "Documentar requerimientos funcionales",
    description: "Detallar todas las funcionalidades del sistema ERP",
    status: "en-progreso",
    assignee: "Sebastián",
    phase: 1,
  },
  {
    id: 5,
    title: "Diseñar sistema de colores",
    description: "Establecer la paleta de colores y guía de estilo visual",
    status: "pendiente",
    assignee: "Ariadna",
    phase: 2,
  },
  {
    id: 6,
    title: "Configurar entorno de desarrollo",
    description: "Preparar herramientas y configuraciones para el desarrollo",
    status: "pendiente",
    assignee: "José Camilo",
    phase: 2,
  },
  {
    id: 7,
    title: "Crear prototipos interactivos",
    description: "Desarrollar prototipos funcionales en Figma",
    status: "pendiente",
    assignee: "Ariadna",
    phase: 2,
  },
  {
    id: 8,
    title: "Definir base de datos",
    description: "Diseñar el esquema de base de datos del sistema",
    status: "pendiente",
    assignee: "Sebastián",
    phase: 3,
  },
]

// Datos de progreso
const progressData = {
  overall: 35,
  teamMembers: {
    Ariadna: 50,
    "José Camilo": 30,
    Sebastián: 25,
  },
  achievements: [
    { id: 1, title: "Primera Fase Completada", completed: true },
    { id: 2, title: "Diseño Innovador", completed: true },
    { id: 3, title: "Velocidad de Desarrollo", completed: true },
  ],
}

// Estado de la aplicación
let currentTasks = [...tasksData]
let currentTheme = localStorage.getItem("theme") || "light"

// Elementos del DOM
const elements = {
  statusFilter: document.getElementById("status-filter"),
  memberFilter: document.getElementById("member-filter"),
  tasksContainer: document.getElementById("tasks-container"),
  emptyState: document.getElementById("empty-state"),
  backToTop: document.getElementById("back-to-top"),
  themeToggle: document.querySelector(".theme-toggle"),
  printBtn: document.querySelector(".print-btn"),
  navLinks: document.querySelectorAll(".nav__link"),
  celebrationConfetti: document.getElementById("celebration-confetti"),
}

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
  initializeApp()
})

function initializeApp() {
  setupTheme()
  setupEventListeners()
  renderTasks()
  setupScrollEffects()
  setupNavigation()
  animateOnLoad()
  initializeProgress()
}

// Configuración del tema
function setupTheme() {
  document.documentElement.setAttribute("data-theme", currentTheme)
  updateThemeIcon()
}

function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light"
  document.documentElement.setAttribute("data-theme", currentTheme)
  localStorage.setItem("theme", currentTheme)
  updateThemeIcon()
}

function updateThemeIcon() {
  const icon = elements.themeToggle.querySelector(".theme-toggle__icon")
  if (currentTheme === "dark") {
    icon.innerHTML = `
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" stroke="currentColor" stroke-width="2" fill="none"/>
    `
  } else {
    icon.innerHTML = `
      <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2"/>
    `
  }
}

// Event Listeners
function setupEventListeners() {
  elements.statusFilter.addEventListener("change", filterTasks)
  elements.memberFilter.addEventListener("change", filterTasks)
  elements.backToTop.addEventListener("click", scrollToTop)
  elements.themeToggle.addEventListener("click", toggleTheme)
  elements.printBtn.addEventListener("click", () => window.print())

  // Navegación por teclado
  document.addEventListener("keydown", handleKeyboardNavigation)
}

function handleKeyboardNavigation(event) {
  if (event.key === "Escape") {
    // Limpiar filtros con Escape
    elements.statusFilter.value = ""
    elements.memberFilter.value = ""
    filterTasks()
  }
}

// Filtrado de tareas
function filterTasks() {
  const statusFilter = elements.statusFilter.value
  const memberFilter = elements.memberFilter.value

  currentTasks = tasksData.filter((task) => {
    const matchesStatus = !statusFilter || task.status === statusFilter
    const matchesMember = !memberFilter || task.assignee === memberFilter
    return matchesStatus && matchesMember
  })

  renderTasks()
}

// Renderizado de tareas
function renderTasks() {
  if (currentTasks.length === 0) {
    showEmptyState()
    return
  }

  hideEmptyState()

  const tasksHTML = currentTasks
    .map(
      (task, index) => `
    <div class="task-card" style="animation-delay: ${index * 0.1}s">
      <div class="task-card__header">
        <div>
          <h3 class="task-card__title">${task.title}</h3>
          <span class="task-card__status task-card__status--${task.status}">
            ${getStatusText(task.status)}
          </span>
        </div>
      </div>
      <p class="task-card__description">${task.description}</p>
      <div class="task-card__assignee">
        <div class="task-card__assignee-avatar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
          </svg>
        </div>
        <span>Asignado a ${task.assignee}</span>
      </div>
    </div>
  `,
    )
    .join("")

  elements.tasksContainer.innerHTML = tasksHTML
}

function getStatusText(status) {
  const statusMap = {
    pendiente: "Pendiente",
    "en-progreso": "En Progreso",
    completada: "Completada",
  }
  return statusMap[status] || status
}

function showEmptyState() {
  elements.tasksContainer.innerHTML = ""
  elements.emptyState.style.display = "block"
}

function hideEmptyState() {
  elements.emptyState.style.display = "none"
}

// Efectos de scroll
function setupScrollEffects() {
  let ticking = false

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleScroll()
        ticking = false
      })
      ticking = true
    }
  })
}

function handleScroll() {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop

  // Mostrar/ocultar botón volver arriba
  if (scrollTop > 300) {
    elements.backToTop.classList.add("visible")
  } else {
    elements.backToTop.classList.remove("visible")
  }

  // Actualizar navegación activa
  updateActiveNavigation()
}

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  })
}

// Navegación
function setupNavigation() {
  elements.navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        const headerHeight = document.querySelector(".header").offsetHeight
        const targetPosition = targetElement.offsetTop - headerHeight - 20

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        })
      }
    })
  })
}

function updateActiveNavigation() {
  const sections = document.querySelectorAll("section[id]")
  const scrollPos = window.scrollY + 100

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.offsetHeight
    const sectionId = section.getAttribute("id")
    const navLink = document.querySelector(`.nav__link[href="#${sectionId}"]`)

    if (navLink) {
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        navLink.classList.add("active")
      } else {
        navLink.classList.remove("active")
      }
    }
  })
}

// Animaciones de carga
function animateOnLoad() {
  // Animar elementos con retraso escalonado
  const animatedElements = document.querySelectorAll(
    ".team-member, .timeline__phase, .tech-item, .achievement-card, .milestone",
  )

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = "running"
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  )

  animatedElements.forEach((element) => {
    observer.observe(element)
  })
}

// Funcionalidad de progreso
function initializeProgress() {
  // Animate progress bars when section comes into view
  const progressSection = document.getElementById("progreso")
  if (progressSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateProgressBars()
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.3 },
    )

    observer.observe(progressSection)
  }
}

function animateProgressBars() {
  // Animate circular progress
  const circularProgress = document.querySelector(".circular-progress__fill")
  if (circularProgress) {
    const progress = progressData.overall
    const circumference = 2 * Math.PI * 50
    const offset = circumference - (progress / 100) * circumference

    setTimeout(() => {
      circularProgress.style.strokeDashoffset = offset
    }, 500)
  }

  // Animate fluid progress bar
  const fluidProgress = document.querySelector(".fluid-progress__fill")
  if (fluidProgress) {
    setTimeout(() => {
      fluidProgress.style.width = `${progressData.overall}%`
    }, 800)
  }

  const milestones = document.querySelectorAll(".milestone-enhanced")
  milestones.forEach((milestone, index) => {
    setTimeout(
      () => {
        milestone.style.animationPlayState = "running"
      },
      1000 + index * 500,
    )
  })

  // Check for celebration
  if (progressData.overall >= 100) {
    setTimeout(() => {
      triggerCelebration()
    }, 2000)
  }
}

function triggerCelebration() {
  const confettiContainer = elements.celebrationConfetti
  if (!confettiContainer) return

  confettiContainer.style.opacity = "1"

  // Create confetti pieces
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div")
    confetti.className = "confetti-piece"
    confetti.style.left = Math.random() * 100 + "%"
    confetti.style.animationDelay = Math.random() * 3 + "s"
    confetti.style.animationDuration = Math.random() * 2 + 2 + "s"

    confettiContainer.appendChild(confetti)
  }

  // Clean up confetti after animation
  setTimeout(() => {
    confettiContainer.style.opacity = "0"
    confettiContainer.innerHTML = ""
  }, 5000)
}

// Utilidades
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Manejo de errores
window.addEventListener("error", (event) => {
  console.error("Error en la aplicación:", event.error)
})

// Accesibilidad mejorada
document.addEventListener("keydown", (event) => {
  // Navegación con Tab mejorada
  if (event.key === "Tab") {
    document.body.classList.add("keyboard-navigation")
  }
})

document.addEventListener("mousedown", () => {
  document.body.classList.remove("keyboard-navigation")
})

// Performance: Lazy loading para imágenes (si las hubiera)
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img)
  })
}

// Exportar funciones para testing (si fuera necesario)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    filterTasks,
    renderTasks,
    toggleTheme,
    tasksData,
    animateProgressBars,
    triggerCelebration,
    progressData,
  }
}
