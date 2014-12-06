(function() {
	var controller = {
		start: function() {
			this.$videoId = $('.js-video-id');
			this.$player = $('.js-player');

			$('.js-open-video-form').on('submit', this.onsubmitOpenVideo.bind(this));
			$('.js-play').on('click', function() { this._player.play() }.bind(this));
			$('.js-pause').on('click', function() { this._player.pause() }.bind(this));
			$('.js-mute').on('click', function() { this._player.mute() }.bind(this));
			$('.js-unmute').on('click', function() { this._player.mute(false) }.bind(this));
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
