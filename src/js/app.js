/**
 * Shower Thoughts
 * K. M. Kroski
 * 21 Nov 2016
 */

var UI = require('ui'), 
    AJAX = require('ajax'),
    VIBE = require('ui/vibe');

var posts = [];

// Screens
var home = new UI.Card({
      title: 'Shower\nThoughts',
      icon: 'images/menu_icon.png',
      style: 'small'
    }),
    menu = new UI.Menu({}),
    post = new UI.Card({
      style: "small",
      scrollable: true
    });

// Get, store and display all posts
function getPosts() {
  home.body('\nLoading...');
  
  AJAX({ 
      url: 'https://www.reddit.com/r/Showerthoughts/hot.json', 
      type: 'json' 
    },
    function(data) {
      // Parse and store post data
      posts = [];
      for (var i = 0; i < data.data.children.length; i++) {
        if (data.data.children[i].data.domain != "self.Showerthoughts") {
          continue;
        }
        
        posts.push({
          title: data.data.children[i].data.title,
          description: data.data.children[i].data.description,
          author: 'u/' + data.data.children[i].data.author
        }); 
      }
      
      // Create menu's list items
      var menu_items = [];
      for (var j = 0; j < posts.length; j++) {
        menu_items.push({
          title: posts[j].title,
          subtitle: posts[j].author
        });
      }
      
      // Update menu's list items
      menu.section(0, { 
        title: 'Shake to refresh!',
        items: menu_items 
      });
      
      VIBE.vibrate('short');  // Let user know data has refreshed
      menu.show(); // Show menu with new items
      
      home.body('\nHit back to exit.\n\nHit select to resume.');
    },
    function(error) {
      home.body("\nCould not get posts.\n\nShake to retry.");
      home.show();
    }
  );
}

menu.on('accelTap', function (e) {  // Menu's shake to refresh
  getPosts();
});

menu.on('select', function (e) {  // Menu's select button
  post.title(posts[e.itemIndex].title);
  post.subtitle(posts[e.itemIndex].description);
  post.body(posts[e.itemIndex].author);
  post.show();
});

home.on('accelTap', function (e) {  // Home's shake to refresh
  getPosts();
});

home.on('click', 'select', function (e) {  // Home's Select button
  if (posts.length > 0) {
    menu.show();
  } else {
    getPosts();
  }
});

// Let's roll!
home.show();
getPosts();