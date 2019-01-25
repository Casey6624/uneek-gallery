updateTitleSetting = (settingType) => {
  this.fetchWP.post( 'adminTitle', { title: this.state.title } )
  .then((json) => this.processOkResponse(json, 'saved', settingType),(err) => this.setState({
      notice: {type: 'error', message: err.message}}));
}

deleteTitleSetting = (settingType) => {
  this.fetchWP.delete( 'adminTitle' )
  .then((json) => this.processOkResponse(json, 'deleted', settingType),(err) => console.log('error', err));
}