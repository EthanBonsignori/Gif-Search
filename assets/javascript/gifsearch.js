let topics = ['game of thrones', 'stranger things', 'spongebob squarepants', 'last week tonight', 'seinfeld', 'curb your enthusiasm']
let searchButtonContainer = $('#search-button-container')

let generateButtons = () => {
  searchButtonContainer.empty()
  for (let i = 0; i < topics.length; i++) {
    let button = $(`<button type="button" class="btn btn-info search-button" data-value="${topics[i]}">`)
    let buttonText = topics[i]
    button.text(buttonText)
    searchButtonContainer.append(button)
  }
}

$(document).on('click', '#submit-button', function (event) {
  event.preventDefault()

  let newButton = $('#new-show').val()
  // if (topics.indexOf(newButton) === -1) {
  topics.push(newButton)
  // }
  generateButtons()
})

$(document).on('click', '.search-button', function () {
  
  let searchTerm = $(this).attr('data-value')
  let api = `4IYY54HZyXsYnTziL6RL5YrOlTPBe8Ab&q`
  let limit = $('#limit-select').val()
  console.log(searchTerm)

  let queryUrl = `https://api.giphy.com/v1/gifs/search?api_key=${api}&q=${searchTerm}&limit=${limit}`
  console.log(queryUrl)
})

generateButtons()
