(function() {
	var controller = {
		start: function() {
			this.$videoId = $('.js-video-id');
			this.$player = $('.js-player');

			$('.js-open-video-form').on('submit', this.onsubmitOpenVideo.bind(this));
		},

		openVideo: function(id) {
			var player = this.getPlayer();
			player.open({ id:id });
		},

		getPlayer: function() {
			if (!this._player) {
				this._player = new YouTube({
					$el: this.$player
				});
			}
			return this._player;
		},

		onsubmitOpenVideo: function(event) {
			event.preventDefault();
			var id = this.$videoId.val();
			this.openVideo(id);
		}
	};

	$(function() {
		controller.start();
	});
})();
