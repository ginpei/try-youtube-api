(function() {
	var controller = {
		start: function() {
			this.$id = $('.js-playlist-id');
			this.$player = $('.js-player');
			this.$list = $('.js-thumbnails');

			$('.js-playlist-form').on('submit', this.onsubmit.bind(this));
			$('.js-thumbnails').on('click', '.js-thumbnail-play', this.onclickPlay.bind(this));
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
					description: item.description,
					id: item.id,
					title: item.title,
					thumbnailSrc: item.thumbnails.default.url
				});
			});
			this.$list.html(html);
		},

		play: function(id) {
			var video = new GpYoutube.Video({
				id: id
			});
			video.renderInto(this.$player);
		},

		onsubmit: function(event) {
			event.preventDefault();
			var id = this.$id.val();
			this.load(id);
		},

		onclickPlay: function(event) {
			var $thumbnail = $(event.currentTarget).closest('.js-thumbnail');
			var id = $thumbnail.attr('data-id');
			this.play(id);
		},

		template_thumbnail: _.template($('#template-thumbnail').prop('text'))
	};

	$(function() {
		controller.start();
	});
})();
