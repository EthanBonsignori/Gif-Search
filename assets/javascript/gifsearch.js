let series = ['game of thrones', 'stranger things', 'orange is the new black', 'spongebob squarepants', 'the good place', 'last week tonight', 'seinfeld', 'curb your enthusiasm', 'the office', 'breaking bad']
let movies = ['forrest gump', 'godfather', 'lord of the rings: the fellowship of the ring', 'star wars: episode v', 'trolls 2']

let buttonType
let initVars = () => {
  buttonType = 'neither'
}
// Create buttons based on what is in the topics array
let generateButtons = (type) => {
  let seriesButtons = $('#series')
  let movieButtons = $('#movies')
  if ( type === 'series' ) {
    $('#series .search-button').remove()
    for (let i = 0; i < series.length; i++) {
      let button = $(`<button type="button" class="btn btn-info search-button ${type}" data-value="${series[i]}">`)
      let buttonText = series[i]
      button.text(buttonText)
      seriesButtons.append(button)
    }
  }
  if ( type === 'movie' ) {
    $('#movies .search-button').remove()
    for (let i = 0; i < movies.length; i++) {
      let button = $(`<button type="button" class="btn btn-info search-button ${type}" data-value="${movies[i]}">`)
      let buttonText = movies[i]
      button.text(buttonText)
      movieButtons.append(button)
    }
  }
  initVars()
}

// When the user clicks the submit button, begin adding new button
$(document).on('click', '#submit-button', function () {
  checkButton()
})
// Prevent page from reloading when user presses the enter key
$('#search-form').submit(function () {
  checkButton()
  return false
})

let checkButton = () => {
  let newButton = $('#new-title').val().trim().toLowerCase()
  checkMovieOrShow(newButton)
}

let checkMovieOrShow = (input) => {
  let queryURL = `https://www.omdbapi.com/?t=${input}&apikey=trilogy`

  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function (response) {
    let type = response.Type
    console.log(type)
    if (type === 'series') {
      buttonType = 'series'
    }
    if (type === 'movie') {
      buttonType = 'movie'
    }
    if (response.Response === 'False') {
      buttonType = 'neither'
      console.log('Not a movie or tv show!')
    }
    checkString(input, buttonType)
  })
}

let checkString = (text, type) => {
  let alert = $('.alert')
  if (text === '') {
    alert.html(`<strong>Some text is required!</strong>`)
    alert.addClass('show')
    return
  }
  if (series.indexOf(text) >= 0 || movies.indexOf(text) >= 0) {
    alert.html(`<strong>Button already exists!</strong>`)
    alert.addClass('show')
    return
  }
  if (type === 'neither') {
    alert.html(`<strong>That isn't a movie or TV show!</strong>`)
    alert.addClass('show')
    return
  }
  alert.removeClass('show')
  if (type === 'series') {
    series.push(text)
  }
  if (type === 'movie') {
    movies.push(text)
  }
  generateButtons(type)
}

// Search and append gifs
$(document).on('click', '.search-button', function () {
  let gifDisplay = $('#gif-display')
  gifDisplay.empty()
  let searchTerm = $(this).attr('data-value')
  let api = `4IYY54HZyXsYnTziL6RL5YrOlTPBe8Ab&q`
  let limit = $('#limit-select').val()
  let queryUrlgifs = `https://api.giphy.com/v1/gifs/search?api_key=${api}&q=${searchTerm}&limit=${limit}`

  displayInfo(searchTerm)

  // Get gifs from giphy
  $.ajax({
    url: queryUrlgifs,
    method: 'GET'
  }).then(function (response) {
    // console.log(response)
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

// Shows movie info and poster
let displayInfo = (term) => {
  console.log('getting info...')
  let seriesSelector = $('#info')
  seriesSelector.empty()
  let queryURL = `https://www.omdbapi.com/?t=${term}&apikey=trilogy`
  // Creating an AJAX call for the specific show
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function (response) {
    console.log(response)
    let imdbId = response.imdbID
    let imdbLink = `https://www.imdb.com/title/${imdbId}/`
    // Create html elements with info from ajax call
    let infoDiv = $(`
      <div class='show'>
        <h3>${response.Title}</h3>
        <p><b>Rating: </b>${response.Rated}</p>
        <p><b>First Released: </b>${response.Released}</p>
        <p>${response.Plot}</p>
        <div id="poster-div">
          <a href="${imdbLink}" target="_blank">
            <img src="${response.Poster}" id="poster">
            <p id="imdb"><i class="fab fa-imdb"></i></p>
          </a>
        </div>
      </div>
    `)
    // Append newly created html elements
    $('#info').append(infoDiv)
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

let getTooltips = () => {
  $('[data-toggle="tooltip"]').tooltip()
}

$(document).ready(function () {

  $('#sidebar').mCustomScrollbar({
    theme: 'minimal'
  })
})


generateButtons('series')
generateButtons('movie')