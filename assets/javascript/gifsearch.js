let topics = ['game of thrones', 'stranger things', 'orange is the new black', 'spongebob squarepants', 'the good place', 'the haunting of hill house', 'last week tonight', 'seinfeld', 'curb your enthusiasm', 'the office', 'breaking bad']

// Create buttons based on what is in the topics array
let generateButtons = () => {
  let searchButtonContainer = $('#search-button-container')
  searchButtonContainer.empty()
  for (let i = 0; i < topics.length; i++) {
    let button = $(`<button type="button" class="btn btn-info search-button" data-value="${topics[i]}">`)
    let buttonText = topics[i]
    button.text(buttonText)
    searchButtonContainer.append(button)
  }
}

// Add new button to the list
$(document).on('click', '#submit-button', function () {
  let newButton = $('#new-show').val().trim().toLowerCase()
  checkString(newButton)
})

let checkString = (text) => {
  let alert = $('.alert')
  if (text === '') {
    alert.html(`<strong>Some text is required!</strong>`)
    alert.addClass('show')
    return
  }
  if (topics.indexOf(text) >= 0) {
    console.log('already have that button')
    alert.html(`<strong>You already have a button for that!</strong>`)
    alert.addClass('show')
    return
  }
  alert.removeClass('show')
  topics.push(text)
  generateButtons()
}

// Search and append gifs
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
      let still = path.images.fixed_height_still.url
      let animated = path.images.fixed_height.url
      let original = path.images.original.url
      let title = path.title
      let rating = path.rating
      let newGif = $(`
        <figure>
        <figcaption>rating: ${rating}</figcaption>
        <img src="${still}" 
        data-still="${still}" 
        data-animate="${animated}" 
        data-state="still"
        class="gif">
        <figcaption><a href="${original}" download="${title}>Download</a>
        </figure`)
      gifDisplay.append(newGif)
    }
  })
})

// Pause and play gifs when clicked on
$(document).on('click', '.gif', function () {
  let state = $(this).attr('data-state')
  if (state === 'still') {
    $(this).attr('src', $(this).attr('data-animate'))
    $(this).attr('data-state', 'animate')
  } else {
    $(this).attr('src', $(this).attr('data-still'))
    $(this).attr('data-state', 'still')
  }
})

// Prevent page from reloading when user presses the enter key
$('#search-form').submit(function () {
  let newButton = $('#new-show').val().trim().toLowerCase()
  checkString(newButton)
  return false
})

generateButtons()
