(function() {
	var controller = {
		start: function() {
			this.$id = $('.js-playlist-id');
			$('.js-playlist-form').on('submit', this.onsubmit.bind(this));
		},

		load: function(id) {
			var playlist = this.playlist = new GpYoutube.Playlist({
				appKey: 'AIzaSyAiUcCptyBwx6nRXicSWJUxgtZ5SLaeQuE',
				id: id
			});

			playlist.fetch()
				.then(this.renderThumbnail.bind(this));
		},

		renderThumbnail: function(data) {
			var template = this.template_thumbnail;
			var html = '';
			this.playlist.forEach(function(item, index) {
				html += template({
					title: item.title,
					description: item.description,
					thumbnailSrc: item.thumbnails.default.url
				});
			});
			$('.js-thumbnails').html(html);
		},

		onsubmit: function(event) {
			event.preventDefault();
			var id = this.$id.val();
			this.load(id);
		},

		template_thumbnail: _.template($('#template-thumbnail').prop('text'))
	};

	$(function() {
		controller.start();
	});
})();
