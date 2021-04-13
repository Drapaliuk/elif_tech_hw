const { series, parallel, src, dest } = require('gulp')

function clean(done) {
    console.log('CLEAN')
    done()
}

function build(done) {
    console.log('BUILD')
    done()
}


function streamTask() {
    return src('test.js').pipe(dest('source'))
}

exports.default = streamTask