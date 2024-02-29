const {wp} = require('./run');

function createAdminUser() {
  try {
    wp('user create admin admin@planet4.test --user_pass=admin --role=administrator');
  } catch (error) {
    wp('user update admin --user_pass=admin --user_email=admin@planet4.test --role=administrator');
  }
}

module.exports = {
  createAdminUser,
};
