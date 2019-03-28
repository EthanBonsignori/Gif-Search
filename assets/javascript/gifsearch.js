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
  let gifDisplay = $('#gif-display')
  gifDisplay.empty()
  let searchTerm = $(this).attr('data-value')
  let api = `4IYY54HZyXsYnTziL6RL5YrOlTPBe8Ab&q`
  let limit = $('#limit-select').val()
  let queryUrl = `https://api.giphy.com/v1/gifs/search?api_key=${api}&q=${searchTerm}&limit=${limit}`

  $.ajax({
    url: queryUrl,
    method: 'GET'
  }).then(function (response) {
    console.log(response)
    for (let i = 0; i <= limit; i++) {
      let path = response.data[i]
      let gifStill = path.images.fixed_height_still.url
      let gifAnimated = path.images.fixed_height.url
      let rating = path.rating
      let newGif = $(`
        <figure>
        <figcaption>rating: ${rating}</figcaption>
        <img src="${gifStill}" 
        data-still="${gifStill}" 
        data-animate="${gifAnimated}" 
        data-state="still"
        class="gif">
        </figure`)
      gifDisplay.append(newGif)
    }
  })
})

generateButtons()
