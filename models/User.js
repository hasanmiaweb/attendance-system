const { model, Schema } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 10,
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
    },
  },
  password: {
    type: String,
    minlength: 3,
    required: true,
  },
  roles: {
    type: [String],
    required: true,
    default: ["STUDENT"],
  },
  accountStatus: {
    type: String,
    enum: ["PENDDING", "ACTIVE", "REJECT"],
    default: "PENDDING",
  },
});

const User = model("User", userSchema);

module.exports = User;
