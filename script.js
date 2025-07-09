const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const inputPergunta = document.getElementById('inputPergunta')
const askButton = document.getElementById('askButton')
const iaResponse = document.getElementById('iaResponse')
const formulario = document.getElementById('formulario')

const enviarFormulario = (event) => {
    event.preventDefault()
}

formulario.addEventListener('submit', enviarFormulario)