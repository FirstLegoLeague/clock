function AudioService() {
    function init(file, cb) {
        new Audio5js({
            swf_path: 'swf/audio5js.swf',
            ready: function() {
                this.load(file);
                this.reset = function() {
                    this.pause();
                    this.load(file);
                };
                cb(this);
            }
        });
    }

    return {
        init: init
    };
}
