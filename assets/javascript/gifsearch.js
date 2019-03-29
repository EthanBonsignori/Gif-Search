let topics = ['game of thrones', 'stranger things', 'orange is the new black', 'spongebob squarepants', 'the good place', 'last week tonight', 'seinfeld', 'curb your enthusiasm', 'the office', 'breaking bad']

// Create buttons based on what is in the topics array
let generateButtons = () => {
  let searchButtonContainer = $('#search-button-container')
  $('.search-button').remove()
  $('#divider').remove()
  for (let i = 0; i < topics.length; i++) {
    let button = $(`<button type="button" class="btn btn-info search-button" data-value="${topics[i]}">`)
    let buttonText = topics[i]
    button.text(buttonText)
    searchButtonContainer.append(button)
  }
  searchButtonContainer.append($('<hr id="divider">'))
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
  let queryUrlgifs = `https://api.giphy.com/v1/gifs/search?api_key=${api}&q=${searchTerm}&limit=${limit}`

  displayShowInfo(searchTerm)

  // Get gifs from giphy
  $.ajax({
    url: queryUrlgifs,
    method: 'GET'
  }).then(function (response) {
    console.log(response)
    for (let i = 0; i <= limit; i++) {
      let path = response.data[i]
      let still = path.images.fixed_height_still.url
      let animated = path.images.fixed_height.url
      let original = path.images.original.url
      let rating = path.rating
      let newGif = $(`
        <figure class="gif-figure">
          <figcaption>rating: ${rating}</figcaption>
          <img src="${still}" 
            data-still="${still}" 
            data-animate="${animated}" 
            data-state="still"
            class="gif">
          <a class="download" 
            data-toggle="tooltip" 
            data-placement="top" 
            title="Source" 
            href="${original}" 
            target="_blank">
              <i class="fas fa-download"></i>
          </a>
        </figure`)
      gifDisplay.append(newGif)
      getTooltips()
    }
  })
})

// displayMovieInfo function re-renders the HTML to display the appropriate content
let displayShowInfo = (term) => {
  let showSelector = $('#show-info')
  showSelector.empty()
  let queryURLshow = `https://www.omdbapi.com/?t=${term}&apikey=trilogy`;
  // Creating an AJAX call for the specific show
  $.ajax({
    url: queryURLshow,
    method: 'GET'
  }).then(function (response) {
    console.log(response)
    let imdbId = response.imdbID
    let imdbLink = `https://www.imdb.com/title/${imdbId}/`
    console.groupCollapsed(imdbId)
    // Create html elements with info from ajax call and append them
    let showDiv = $("<div class='show'>")
    let title = $('<h3 id="program-title">').text(`${response.Title}`)
    showDiv.append(title)
    let pOne = $('<p>').html(`<b>Rating: </b> ${response.Rated}`)
    showDiv.append(pOne)
    let pTwo = $('<p>').html(`<b>First Episode: </b> ${response.Released}`)
    showDiv.append(pTwo)
    let pThree = $('<p>').text(`${response.Plot}`)
    showDiv.append(pThree)
    let imageDiv = $('<div id="poster-div">')
    let imageLink = $(`<a>`).attr('href', imdbLink)
    imageLink.attr('target', '_blank')
    imageDiv.append(imageLink)
    let image = $(`<img id="poster">`).attr('src', response.Poster)
    imageLink.append(image)
    let imdb = $('<p id="imdb">').html(`<i class="fab fa-imdb"></i>`)
    imageLink.append(imdb)
    showDiv.append(imageDiv)
    
    $('#show-info').append(showDiv)
  })
}

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

let getTooltips = () => {
  $('[data-toggle="tooltip"]').tooltip()
}

$(document).ready(function () {

  $('#sidebar').mCustomScrollbar({
    theme: 'minimal'
  })
})

generateButtons()
