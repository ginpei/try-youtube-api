(function() {
	var controller = {
		start: function() {
			this.$id = $('.js-playlist-id');
			this.$player = $('.js-player');
			this.$list = $('.js-thumbnails');

			$('.js-play').on('click', this.onclickPlay.bind(this));
			$('.js-pause').on('click', this.onclickPause.bind(this));
			$('.js-stop').on('click', this.onclickStop.bind(this));
			$('.js-mute').on('click', this.onclickMute.bind(this));
			$('.js-unmute').on('click', this.onclickUnmute.bind(this));

			$('.js-playlist-form').on('submit', this.onsubmit.bind(this));
			$('.js-thumbnails').on('click', '.js-thumbnail-play', this.onclickStart.bind(this));
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
			var video = this.video = new GpYoutube.Video({
				id: id
			});
			video.renderInto(this.$player);
		},

		onclickPlay: function(event) {
			this.video.play();
		},

		onclickPause: function(event) {
			this.video.pause();
		},

		onclickStop: function(event) {
			this.video.stop();
		},

		onclickMute: function(event) {
			this.video.mute();
		},

		onclickUnmute: function(event) {
			this.video.unmute();
		},

		onsubmit: function(event) {
			event.preventDefault();
			var id = this.$id.val();
			this.load(id);
		},

		onclickStart: function(event) {
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
