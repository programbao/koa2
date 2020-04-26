class Boy {
  @speak('中文')
  run() {
    console.log('i can run!');
    console.log('i can speak!' + this.language);

  }
}

function speak(language) {
  return function (target, key, descriptor) {
    console.log(target);
    console.log(key);
    console.log(descriptor);
    target.language = language
    return descriptor
  }
}

const programbao = new Boy()
programbao.run()