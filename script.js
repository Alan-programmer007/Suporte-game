const apiKeyInput = document.getElementById('apiKey')
const gameSelect = document.getElementById('gameSelect')
const inputPergunta = document.getElementById('inputPergunta')
const askButton = document.getElementById('askButton')
const iaResponse = document.getElementById('iaResponse')
const formulario = document.getElementById('formulario')

const markdownToHTML = (text) => {
    const converter = new showdown.Converter()
    return converter.makeHtml(text)
}

const perguntarAI = async(question, game, apiKey) => {
    const model = "gemini-2.5-flash"
    const baseURL =  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`
    const pergunta = `
        ## Especialidade
        Você é um especialista assistente de meta para o jogo ${game}

        ## Tarefa
        Você deve responder as perguntas do usuário com base no seu conhecimento do jogo , estratégias, builds e dicas

        ## Regras
        - Se você não sabe a resposta, responda com 'Não sei' e não tente inventar uma resposta.
        - Se a pergunta não está relacionada ao jogo, responda com 'Está pergunta não está relacionada ao jogo em questão'
        - Considere a data atua ${new Date().toLocaleDateString}
        - Faça pesquisas atualizadas sobre o patch atual, baseando na data atual, para dar uma resposta coerente.
        - Nuca responda itens que você não tenha certeza de que existe no patch atual.

        ## Resposta
        - Economiza na resposta, seja direto e responda no máximo 500 caracteres
        - Responda em markdown
        - Não precisa fazer nenhuma saudação ou despedida, apenas reposda o que o usuário está querendo.

        ## Exemplo de resposta
        Pergunta do usuário: Melhor biuld rengar jungle
        Resposta: A build mais atual é: \n\n **Itens:**\n\n coloque os itens aqui. \n\n**Runas**\n\nexemplo de runas.\n\n

        ---
        Aqui está a pergunta do usuário: ${question}
    `
    const contents = [{
        role: "user",
        parts: [{
            text: pergunta
        }]
    }]

    const tools = [{
        google_search: {}
    }]

    const reponse = await fetch(baseURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents,
            tools
        })
    })

    const data = await reponse.json()
    return data.candidates[0].content.parts[0].text
}

const enviarFormulario = async(event) => {
    event.preventDefault()
    const apiKey = apiKeyInput.value
    const game = gameSelect.value
    const question = inputPergunta.value

    if(apiKey == '' || game == '' || question == ''){
        alert('Por favor, preencha todos os campos!')
        return
    }

    askButton.disabled = true
    askButton.textContent = 'Perguntando...'
    askButton.classList.add('loading')

    try{
        const text = await perguntarAI(question, game, apiKey)
        iaResponse.querySelector('.reponse-content').innerHTML = markdownToHTML(text)
        iaResponse.classList.remove('hidden')
    } catch(error) {
        console.log("Error ", error)
    } finally {
        askButton.disabled = false
        askButton.textContent = 'Perguntar'
        askButton.classList.remove('loading')
    }
}

formulario.addEventListener('submit', enviarFormulario)