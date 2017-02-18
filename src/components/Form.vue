<template>
    <div class="row">
        <div class="col-md-6 col-md-offset-3">
            <div class="panel panel-default">
                <div class="panel-body">
                    <div class="alert alert-success" role="alert" v-if="success">Form send successful. Time - {{
                        moment('now').format('MMMM Do YYYY, h:mm:ss') }}
                    </div>
                    <form class="form-horizontal">
                        <div
                            :class="['form-group required', {'has-error': formErrors.nickname != undefined && hasErrors }]">
                            <label for="nickname" class="col-sm-2 control-label">Nickname</label>
                            <div class="col-sm-10">
                                <input type="text" v-model="formData.nickname" class="form-control" id="nickname"
                                       name="nickname"
                                       v-validate:formData.nickname="'required|min:4|max:26'"
                                       placeholder="From 4 to 25 characters">
                                <span v-if="formErrors.nickname !='' && hasErrors" class="help-block">
                                    {{ formErrors.nickname }}
                                </span>
                            </div>
                        </div>
                        <div :class="['form-group', {'has-error': formErrors.gender != undefined && hasErrors }]">
                            <label for="gender" class="col-sm-2 control-label">Gender</label>
                            <div class="col-sm-10">
                                <select v-model="formData.gender" class="form-control" id="gender"
                                        name="gender"
                                >
                                    <option value="">Not specyfied</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                                <span v-if="formErrors.gender !='' && hasErrors" class="help-block">
                                    {{ formErrors.gender }}
                                </span>
                            </div>
                        </div>
                        <div :class="['form-group required', {'has-error': formErrors.age != undefined && hasErrors }]">
                            <label for="age" class="col-sm-2 control-label">Age</label>
                            <div class="col-sm-10">
                                <input type="number" v-model="formData.age" class="form-control" id="age"
                                       name="age"
                                       v-validate:formData.age="'required|numeric|min_value:0'">
                                <span v-if="formErrors.age !='' && hasErrors" class="help-block">
                                    {{ formErrors.age }}
                                </span>
                            </div>
                        </div>
                        <div :class="['form-group', {'has-error': formErrors.message != undefined && hasErrors }]">
                            <label for="message" class="col-sm-2 control-label">Message</label>
                            <div class="col-sm-10">
                                <textarea v-model="formData.message" class="form-control" id="message"
                                       name="message"
                                          v-validate:formData.message="'required'"></textarea>
                                <span v-if="formErrors.message !='' && hasErrors" class="help-block">
                                    {{ formErrors.message }}
                                </span>
                            </div>
                        </div>
                        <div class="form-group">
                            <div class="col-sm-offset-2 col-sm-10">
                                <div class="checkbox">
                                    <label>
                                        <input type="checkbox" v-model="formData.checkbox"> I have read and agree to the terms of use
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
    </div>
</template>

<script>
    import moment from 'moment';
    const dictionary = {
        en: {
            messages: {
                min: () => 'It\'s too short',
                max: () => 'It\'s too long',
                required: () => 'The field is required'
            }
        }
    };

    export default {
        name: 'form',
        data () {
            return {
                formData: {
                    gender: ''
                },
                formErrors: {},
                hasErrors: false,
                success: false
            }
        },
        created() {
            this.$validator.updateDictionary(dictionary);
        },
        methods: {
            validateForm: function ()
            {
                this.success = false;
                this.formErrors = {};
                this.hasErrors = false;
                this.$validator.validateAll().then(() =>
                {
                    this.success = true;
                }).catch(() =>
                {
                    this.hasErrors = true;
                    this.$validator.getErrors().errors.forEach(e =>
                    {
                        if (!this.formErrors[e.field]) {
                            this.formErrors[e.field] = e.msg;
                        }
                    })
                });
            },
            clearForm: function ()
            {
                this.formErrors = {};
                this.hasErrors = false;
                this.formData = {
                    gender: this.formData.gender
                };
                this.success = false;
            },
            moment: function ()
            {
                return moment();
            }
        }
    }
</script>