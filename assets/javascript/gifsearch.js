// Array of titles to create buttons for when the page loads
let series = ['game of thrones', 'stranger things', 'spongebob', 'the good place', 'last week tonight', 'curb your enthusiasm', 'seinfeld', 'the office', 'breaking bad', 'freaks and geeks']
let movies = ['forrest gump', 'the room', 'the godfather', 'lord of the rings: the two towers', 'star wars: episode v', 'troll 2', 'toy story 4', 'lebowski']

// Will hold the whether the clicked button is a movie or series
let buttonType = ''

// Create buttons based on the series & movies arrays
let generateButtons = (type) => {
  let seriesButtons = $('#series')
  let movieButtons = $('#movies')
  if (type === 'series') {
    $('#series .search-button').remove()
    for (let i = 0; i < series.length; i++) {
      let button = $(`<button type="button" class="btn btn-info search-button" data-type="${type}" data-name="${series[i]}">`)
      let buttonText = series[i]
      button.text(buttonText)
      seriesButtons.append(button)
    }
  }
  if (type === 'movie') {
    $('#movies .search-button').remove()
    for (let i = 0; i < movies.length; i++) {
      let button = $(`<button type="button" class="btn btn-info search-button" data-type="${type}" data-name="${movies[i]}">`)
      let buttonText = movies[i]
      button.text(buttonText)
      movieButtons.append(button)
    }
  }
  // Reset the button type
  buttonType = ''
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

// Run the input through the omdb api to check if it's a movie, show, or neither
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
    checkTitle(input, buttonType)
  })
}

// Check if proposed button has text, and doesn't already exist.
let checkTitle = (title, type) => {
  let alert = $('.alert')
  if (title === '') {
    alert.html(`<strong>Some text is required!</strong>`)
    alert.addClass('show')
    return
  }
  if (series.indexOf(title) >= 0 || movies.indexOf(title) >= 0) {
    alert.html(`<strong>Button already exists!</strong>`)
    alert.addClass('show')
    return
  }
  if (type === 'neither') {
    alert.html(`<strong>Could not find that title... Check the spelling and try again.</strong>`)
    alert.addClass('show')
    return
  }
  alert.removeClass('show')
  // Push button to correct array based on the response from the omdb ajax
  if (type === 'series') {
    series.push(title)
  }
  if (type === 'movie') {
    movies.push(title)
  }
  generateButtons(type)
}

// Search and append gifs
$(document).on('click', '.search-button', function () {
  // Select the gif container and empty it
  let gifDisplay = $('#gif-display')
  gifDisplay.empty()
  // Get data from clicked button
  let searchType = $(this).attr('data-type')
  let searchTerm = $(this).attr('data-name')
  // Set up query URL for giphy api
  let api = `4IYY54HZyXsYnTziL6RL5YrOlTPBe8Ab&q`
  let limit = $('#limit-select').val()
  let queryUrlgifs = `https://api.giphy.com/v1/gifs/search?api_key=${api}&q=${searchTerm}&limit=${limit}`
  displayInfo(searchTerm, searchType)
  // Get gifs from giphy api
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
      // Buiild each gif
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

// Find and display info for the movie or show on the sidebar
let displayInfo = (term, type) => {
  let dateText = ''
  if (type === 'movie') {
    dateText = 'Released: '
  } else {
    dateText = 'First Episode: '
  }
  let seriesSelector = $('#info')
  seriesSelector.empty()
  let queryURL = `https://www.omdbapi.com/?t=${term}&apikey=trilogy`
  // Creating an AJAX call for the specific title
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
        <p id="rating-text"><b>Rating: </b>${response.Rated}</p>
        <p id="date-text"><b>${dateText}</b>${response.Released}</p>
        <p>${response.Plot}</p>
        <div id="poster-div">
          <a href="${imdbLink}" target="_blank">
            <img src="${response.Poster}" id="poster" alt="Poster">
            <p id="imdb"><i class="fab fa-imdb"></i></p>
          </a>
        </div>
        <h6 id="poster-text">click poster for more info</h6>
      </div>
    `)
    // Append newly created html elements
    $('#info').append(infoDiv)
    // Check if tv series or movie and change info to match
    if (type === 'series') {
      // If its a show, display how long it has been running
      let year = response.Year
      if (year.charAt(4) === '–' && year.charAt(5) === '') {
        year = `${response.Year}Present`
      }
      $('#date-text').append(`
        <p class="mt-2"><b>Seasons: </b>${response.totalSeasons} (${year})</p>
      `)
    }
    // Display metascore if it exists and imdb rating if not (usually only metascore for movies)
    let metascore = response.Metascore
    let imdbRating = response.imdbRating
    let score = `<p class="mt-2"><b>Metascore: </b>${metascore}</p>`
    if (metascore === 'N/A') {
      score = `<p class="mt-2"><b>IMDb Score: </b> <i class="fas fa-star"></i> ${imdbRating}</p>`
    }
    // If neither metascore or imdb rating exist - assume it is unreleased
    if (metascore === 'N/A' && imdbRating === 'N/A') {
      $('#rating-text').html(`<b>Rating: </b>Unreleased</p>`)
      $('#date-text').html(`<b>Release date: </b>${response.Released}`)
      score = `<p class="mt-2"><b>Metascore: </b>Unreleased</p>`
    }
    $('#date-text').append(score)
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

// Allows bootstrap tooltips to function
let getTooltips = () => {
  $('[data-toggle="tooltip"]').tooltip()
}

// Load the custom scrollbar for the sidebar
$(document).ready(function () {
  $('#sidebar').mCustomScrollbar({
    theme: 'minimal'
  })
})

// Call first, creates buttons for each item in the existing arrays
generateButtons('series')
generateButtons('movie')
