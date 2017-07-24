<template>
    <div class="row" id="test-form">
        <div class="col-md-6">
            <div class="panel panel-default">
                <div class="panel-body">
                    <div class="alert alert-success" role="alert" v-if="success">Success. {{
                        moment('now').format('Do MMMM YYYY, HH:mm:ss') }}
                    </div>
                    <div class="alert alert-danger" role="alert" v-if="formBlock">
                        Form submission temporarily blocked, please try again in {{ timeLeft }} seconds
                    </div>
                    <form class="form-horizontal">
                        <div
                                :class="['form-group required', {'has-error': formErrors.has('nickname') }]">
                            <label for="nickname" class="col-sm-2 control-label">Nickname</label>
                            <div class="col-sm-10">
                                <input type="text" v-model="formData.nickname" class="form-control" id="nickname"
                                       :disabled="formBlock"
                                       name="nickname"
                                       placeholder="From 4 to 25 characters">
                                <span v-if="formErrors.has('nickname')" class="help-block">
                                    {{ formErrors.first('nickname') }}
                                </span>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="gender" class="col-sm-2 control-label">Gender</label>
                            <div class="col-sm-10">
                                <select v-model="formData.gender" class="form-control" id="gender"
                                        name="gender" :disabled="formBlock">
                                    <option value="">Not specyfied</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>
                        </div>
                        <div :class="['form-group required', {'has-error': formErrors.has('age') }]">
                            <label for="age" class="col-sm-2 control-label">Age</label>
                            <div class="col-sm-10">
                                <div class="alert alert-success" role="alert" v-if="ageCheck">
                                    Age is too low
                                </div>
                                <input type="number" v-model="formData.age" class="form-control" id="age"
                                       :disabled="formBlock" @blur="checkAge"
                                       name="age">
                                <span v-if="formErrors.has('age')" class="help-block">
                                    {{ formErrors.first('age') }}
                                </span>
                            </div>
                        </div>
                        <div :class="['form-group', {'has-error': formErrors.has('message') }]">
                            <label for="message" class="col-sm-2 control-label">Message</label>
                            <div class="col-sm-10">
                                <textarea v-model="formData.message" class="form-control" id="message"
                                          name="message" :disabled="formBlock"
                                          placeholder="Up to 150 characters"
                                ></textarea>
                                <span v-if="formErrors.has('message')" class="help-block">
                                    {{ formErrors.first('message') }}
                                </span>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-offset-2 col-sm-10">
                                <div class="checkbox">
                                    <label>
                                        <input type="checkbox" :disabled="formBlock" v-model="formData.checkbox">
                                        I have read and agree to the
                                        terms of use
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-offset-2 col-sm-10">
                                <button type="submit" class="btn btn-success" @click.prevent="validateForm">Submit
                                </button>
                                <button type="button" class="btn btn-danger" @click.prevent="clearForm">Clear</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        <div class="col-md-6">
            <ol>
                <li>
                    <p>
                        After 3 attempts of submitting an invalid form it should show a message, something like "Form submission temporarily blocked, please try again in 10 seconds". Then it should block the form from submitting for 10 seconds, and then again the user has 3 attempts to submit a valid form
                    </p>
                </li>
                <li>
                    <p>
                        If the age entered is below 21 yrs, we should still accept the application but the applicant will get a limited functionality. In this case we should show a small tip below the age field saying that the users below 21 get limited features
                    </p>
                </li>
            </ol>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import {Validator} from 'vee-validate';

    const dictionary = {
        en: {
            messages: {
                min: () => 'Value is too short',
                max: () => 'Value is too long',
                required: () => 'This field is required',
                min_value: () => 'Age could not be negative'
            }
        }
    };

    export default {
        name: 'form',
        validator: null,
        data() {
            return {
                formData: {
                    gender: ''
                },
                formErrors: null,
                success: false,
                availableAttempts: 3,
                currentAttempts: 0,
                breakTime: 10,
                blockingTime: null,
                formBlock: false,
                timeLeft: 0,
                ageCheck: false,
            }
        },
        created() {
            this.validator = new Validator({
                nickname: 'required|min:4|max:26',
                age: 'required|min_value:0',
                message: 'required|max:150'
            });
            this.$set(this, 'formErrors', this.validator.errorBag)
            this.validator.updateDictionary(dictionary);
        },
        methods: {
            validateForm: function () {
                this.success = false;
                if (this.formBlock) {
                    this.timeLeftCalc();
                    return;
                }
                this.validator.validateAll({
                    nickname: this.formData.nickname,
                    age: this.formData.age,
                    message: this.formData.message,
                }).then((result) => {
                    if (result) {
                        this.success = true;
                        this.currentAttempts = 0;
                    } else {
                        this.currentAttempts++;
                        if (this.currentAttempts >= this.availableAttempts) {
                            this.formBlock = true;
                            this.blockingTime = moment();
                            this.timeLeftCalc();
                        }
                    }
                });

            },
            clearForm: function () {
                this.formErrors.clear();
                this.formData = {
                    gender: this.formData.gender
                };
                this.success = false;
                this.ageCheck = false;
            },
            moment: function () {
                return moment();
            },
            timeLeftCalc: function () {
                const offset = moment().diff(this.blockingTime, 's');
                this.timeLeft = this.breakTime - offset;
                if (this.timeLeft <= 0) {
                    this.formBlock = false;
                    this.currentAttempts = 0;
                }
            },
            checkAge: function() {
                this.ageCheck = !!(this.formData.age && this.formData.age < 21);
            }
        }
    }
</script>

<style>
    textarea {
        resize: vertical;
    }
</style>
