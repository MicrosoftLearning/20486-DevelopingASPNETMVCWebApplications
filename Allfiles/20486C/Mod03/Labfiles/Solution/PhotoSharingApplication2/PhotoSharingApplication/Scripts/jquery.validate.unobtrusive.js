/* NUGET: BEGIN LICENSE TEXT
 *
 * Microsoft grants you the right to use these script files for the sole
 * purpose of either: (i) interacting through your browser with the Microsoft
 * website or online service, subject to the applicable licensing or use
 * terms; or (ii) using the files as included with a Microsoft product subject
 * to that product's license terms. Microsoft reserves all other rights to the
 * files not expressly granted by Microsoft, whether by implication, estoppel
 * or otherwise. Insofar as a script file is dual licensed under GPL,
 * Microsoft neither took the code under GPL nor distributes it thereunder but
 * under the terms set out in this paragraph. All notices and licenses
 * below are for informational purposes only.
 *
 * NUGET: END LICENSE TEXT */
/*!
** Unobtrusive validation support library for jQuery and jQuery Validate
** Copyright (C) Microsoft Corporation. All rights reserved.
*/

/*jslint white: true, browser: true, onevar: true, undef: true, nomen: true, eqeqeq: true, plusplus: true, bitwise: true, regexp: true, newcap: true, immed: true, strict: false */
/*global document: false, jQuery: false */

(function ($) {
    var $jQval = $.validator,
        adapters,
        data_validation = "unobtrusiveValidation";

    function setValidationValues(options, ruleName, value) {
        options.rules[ruleName] = value;
        if (options.message) {
            options.messages[ruleName] = options.message;
        }
    }

    function splitAndTrim(value) {
        return value.replace(/^\s+|\s+$/g, "").split(/\s*,\s*/g);
    }

    function escapeAttributeValue(value) {
        // As mentioned on http://api.jquery.com/category/selectors/
        return value.replace(/([!"#$%&'()*+,./:;<=>?@\[\\\]^`{|}~])/g, "\\$1");
    }

    function getModelPrefix(fieldName) {
        return fieldName.substr(0, fieldName.lastIndexOf(".") + 1);
    }

    function appendModelPrefix(value, prefix) {
        if (value.indexOf("*.") === 0) {
            value = value.replace("*.", prefix);
        }
        return value;
    }

    function onError(error, inputElement) {  // 'this' is the form element
        var container = $(this).find("[data-valmsg-for='" + escapeAttributeValue(inputElement[0].name) + "']"),
            replaceAttrValue = container.attr("data-valmsg-replace"),
            replace = replaceAttrValue ? $.parseJSON(replaceAttrValue) !== false : null;

        container.removeClass("field-validation-valid").addClass("field-validation-error");
        error.data("unobtrusiveContainer", container);

        if (replace) {
            container.empty();
            error.removeClass("input-validation-error").appendTo(container);
        }
        else {
            error.hide();
        }
    }

    function onErrors(event, validator) {  // 'this' is the form element
        var container = $(this).find("[data-valmsg-summary=true]"),
            list = container.find("ul");

        if (list && list.length && validator.errorList.length) {
            list.empty();
            container.addClass("validation-summary-errors").removeClass("validation-summary-valid");

            $.each(validator.errorList, function () {
                $("<li />").html(this.message).appendTo(list);
            });
        }
    }

    function onSuccess(error) {  // 'this' is the form element
        var container = error.data("unobtrusiveContainer"),
            replaceAttrValue = container.attr("data-valmsg-replace"),
            replace = replaceAttrValue ? $.parseJSON(replaceAttrValue) : null;

        if (container) {
            container.addClass("field-validation-valid").removeClass("field-validation-error");
            error.removeData("unobtrusiveContainer");

            if (replace) {
                container.empty();
            }
        }
    }

    function onReset(event) {  // 'this' is the form element
        var $form = $(this),
            key = '__jquery_unobtrusive_validation_form_reset';
        if ($form.data(key)) {
            return;
        }
        // Set a flag that indicates we're currently resetting the form.
        $form.data(key, true);
        try {
            $form.data("validator").resetForm();
        } finally {
            $form.removeData(key);
        }

        $form.find(".validation-summary-errors")
            .addClass("validation-summary-valid")
            .removeClass("validation-summary-errors");
        $form.find(".field-validation-error")
            .addClass("field-validation-valid")
            .removeClass("field-validation-error")
            .removeData("unobtrusiveContainer")
            .find(">*")  // If we were using valmsg-replace, get the underlying error
                .removeData("unobtrusiveContainer");
    }

    function validationInfo(form) {
        var $form = $(form),
            result = $form.data(data_validation),
            onResetProxy = $.proxy(onReset, form),
            defaultOptions = $jQval.unobtrusive.options || {},
            execInContext = function (name, args) {
                var func = defaultOptions[name];
                func && $.isFunction(func) && func.apply(form, args);
            }

        if (!result) {
            result = {
                options: {  // options structure passed to jQuery Validate's validate() method
                    errorClass: defaultOptions.errorClass || "input-validation-error",
                    errorElement: defaultOptions.errorElement || "span",
                    errorPlacement: function () {
                        onError.apply(form, arguments);
                        execInContext("errorPlacement", arguments);
                    },
                    invalidHandler: function () {
                        onErrors.apply(form, arguments);
                        execInContext("invalidHandler", arguments);
                    },
                    messages: {},
                    rules: {},
                    success: function () {
                        onSuccess.apply(form, arguments);
                        execInContext("success", arguments);
                    }
                },
                attachValidation: function () {
                    $form
                        .off("reset." + data_validation, onResetProxy)
                        .on("reset." + data_validation, onResetProxy)
                        .validate(this.options);
                },
                validate: function () {  // a validation function that is called by unobtrusive Ajax
                    $form.validate();
                    return $form.valid();
                }
            };
            $form.data(data_validation, result);
        }

        return result;
    }

    $jQval.unobtrusive = {
        adapters: [],

        parseElement: function (element, skipAttach) {
            /// <summary>
            /// Parses a single HTML element for unobtrusive validation attributes.
            /// </summary>
            /// <param name="element" domElement="true">The HTML element to be parsed.</param>
            /// <param name="skipAttach" type="Boolean">[Optional] true to skip attaching the
            /// validation to the form. If parsing just this single element, you should specify true.
            /// If parsing several elements, you should specify false, and manually attach the validation
            /// to the form when you are finished. The default is false.</param>
            var $element = $(element),
                form = $element.parents("form")[0],
                valInfo, rules, messages;

            if (!form) {  // Cannot do client-side validation without a form
                return;
            }

            valInfo = validationInfo(form);
            valInfo.options.rules[element.name] = rules = {};
            valInfo.options.messages[element.name] = messages = {};

            $.each(this.adapters, function () {
                var prefix = "data-val-" + this.name,
                    message = $element.attr(prefix),
                    paramValues = {};

                if (message !== undefined) {  // Compare against undefined, because an empty message is legal (and falsy)
                    prefix += "-";

                    $.each(this.params, function () {
                        paramValues[this] = $element.attr(prefix + this);
                    });

                    this.adapt({
                        element: element,
                        form: form,
                        message: message,
                        params: paramValues,
                        rules: rules,
                        messages: messages
                    });
                }
            });

            $.extend(rules, { "__dummy__": true });

            if (!skipAttach) {
                valInfo.attachValidation();
            }
        },

        parse: function (selector) {
            /// <summary>
            /// Parses all the HTML elements in the specified selector. It looks for input elements decorated
            /// with the [data-val=true] attribute value and enables validation according to the data-val-*
            /// attribute values.
            /// </summary>
            /// <param name="selector" type="String">Any valid jQuery selector.</param>

            // $forms includes all forms in selector's DOM hierarchy (parent, children and self) that have at least one
            // element with data-val=true
            var $selector = $(selector),
                $forms = $selector.parents()
                                  .addBack()
                                  .filter("form")
                                  .add($selector.find("form"))
                                  .has("[data-val=true]");

            $selector.find("[data-val=true]").each(function () {
                $jQval.unobtrusive.parseElement(this, true);
            });

            $forms.each(function () {
                var info = validationInfo(this);
                if (info) {
                    info.attachValidation();
                }
            });
        }
    };

    adapters = $jQval.unobtrusive.adapters;

    adapters.add = function (adapterName, params, fn) {
        /// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation.</summary>
        /// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
        /// in the data-val-nnnn HTML attribute (where nnnn is the adapter name).</param>
        /// <param name="params" type="Array" optional="true">[Optional] An array of parameter names (strings) that will
        /// be extracted from the data-val-nnnn-mmmm HTML attributes (where nnnn is the adapter name, and
        /// mmmm is the parameter name).</param>
        /// <param name="fn" type="Function">The function to call, which adapts the values from the HTML
        /// attributes into jQuery Validate rules and/or messages.</param>
        /// <returns type="jQuery.validator.unobtrusive.adapters" />
        if (!fn) {  // Called with no params, just a function
            fn = params;
            params = [];
        }
        this.push({ name: adapterName, params: params, adapt: fn });
        return this;
    };

    adapters.addBool = function (adapterName, ruleName) {
        /// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation, where
        /// the jQuery Validate validation rule has no parameter values.</summary>
        /// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
        /// in the data-val-nnnn HTML attribute (where nnnn is the adapter name).</param>
        /// <param name="ruleName" type="String" optional="true">[Optional] The name of the jQuery Validate rule. If not provided, the value
        /// of adapterName will be used instead.</param>
        /// <returns type="jQuery.validator.unobtrusive.adapters" />
        return this.add(adapterName, function (options) {
            setValidationValues(options, ruleName || adapterName, true);
        });
    };

    adapters.addMinMax = function (adapterName, minRuleName, maxRuleName, minMaxRuleName, minAttribute, maxAttribute) {
        /// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation, where
        /// the jQuery Validate validation has three potential rules (one for min-only, one for max-only, and
        /// one for min-and-max). The HTML parameters are expected to be named -min and -max.</summary>
        /// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
        /// in the data-val-nnnn HTML attribute (where nnnn is the adapter name).</param>
        /// <param name="minRuleName" type="String">The name of the jQuery Validate rule to be used when you only
        /// have a minimum value.</param>
        /// <param name="maxRuleName" type="String">The name of the jQuery Validate rule to be used when you only
        /// have a maximum value.</param>
        /// <param name="minMaxRuleName" type="String">The name of the jQuery Validate rule to be used when you
        /// have both a minimum and maximum value.</param>
        /// <param name="minAttribute" type="String" optional="true">[Optional] The name of the HTML attribute that
        /// contains the minimum value. The default is "min".</param>
        /// <param name="maxAttribute" type="String" optional="true">[Optional] The name of the HTML attribute that
        /// contains the maximum value. The default is "max".</param>
        /// <returns type="jQuery.validator.unobtrusive.adapters" />
        return this.add(adapterName, [minAttribute || "min", maxAttribute || "max"], function (options) {
            var min = options.params.min,
                max = options.params.max;

            if (min && max) {
                setValidationValues(options, minMaxRuleName, [min, max]);
            }
            else if (min) {
                setValidationValues(options, minRuleName, min);
            }
            else if (max) {
                setValidationValues(options, maxRuleName, max);
            }
        });
    };

    adapters.addSingleVal = function (adapterName, attribute, ruleName) {
        /// <summary>Adds a new adapter to convert unobtrusive HTML into a jQuery Validate validation, where
        /// the jQuery Validate validation rule has a single value.</summary>
        /// <param name="adapterName" type="String">The name of the adapter to be added. This matches the name used
        /// in the data-val-nnnn HTML attribute(where nnnn is the adapter name).</param>
        /// <param name="attribute" type="String">[Optional] The name of the HTML attribute that contains the value.
        /// The default is "val".</param>
        /// <param name="ruleName" type="String" optional="true">[Optional] The name of the jQuery Validate rule. If not provided, the value
        /// of adapterName will be used instead.</param>
        /// <returns type="jQuery.validator.unobtrusive.adapters" />
        return this.add(adapterName, [attribute || "val"], function (options) {
            setValidationValues(options, ruleName || adapterName, options.params[attribute]);
        });
    };

    $jQval.addMethod("__dummy__", function (value, element, params) {
        return true;
    });

    $jQval.addMethod("regex", function (value, element, params) {
        var match;
        if (this.optional(element)) {
            return true;
        }

        match = new RegExp(params).exec(value);
        return (match && (match.index === 0) && (match[0].length === value.length));
    });

    $jQval.addMethod("nonalphamin", function (value, element, nonalphamin) {
        var match;
        if (nonalphamin) {
            match = value.match(/\W/g);
            match = match && match.length >= nonalphamin;
        }
        return match;
    });

    if ($jQval.methods.extension) {
        adapters.addSingleVal("accept", "mimtype");
        adapters.addSingleVal("extension", "extension");
    } else {
        // for backward compatibility, when the 'extension' validation method does not exist, such as with versions
        // of JQuery Validation plugin prior to 1.10, we should use the 'accept' method for
        // validating the extension, and ignore mime-type validations as they are not supported.
        adapters.addSingleVal("extension", "extension", "accept");
    }

    adapters.addSingleVal("regex", "pattern");
    adapters.addBool("creditcard").addBool("date").addBool("digits").addBool("email").addBool("number").addBool("url");
    adapters.addMinMax("length", "minlength", "maxlength", "rangelength").addMinMax("range", "min", "max", "range");
    adapters.addMinMax("minlength", "minlength").addMinMax("maxlength", "minlength", "maxlength");
    adapters.add("equalto", ["other"], function (options) {
        var prefix = getModelPrefix(options.element.name),
            other = options.params.other,
            fullOtherName = appendModelPrefix(other, prefix),
            element = $(options.form).find(":input").filter("[name='" + escapeAttributeValue(fullOtherName) + "']")[0];

        setValidationValues(options, "equalTo", element);
    });
    adapters.add("required", function (options) {
        // jQuery Validate equates "required" with "mandatory" for checkbox elements
        if (options.element.tagName.toUpperCase() !== "INPUT" || options.element.type.toUpperCase() !== "CHECKBOX") {
            setValidationValues(options, "required", true);
        }
    });
    adapters.add("remote", ["url", "type", "additionalfields"], function (options) {
        var value = {
            url: options.params.url,
            type: options.params.type || "GET",
            data: {}
        },
            prefix = getModelPrefix(options.element.name);

        $.each(splitAndTrim(options.params.additionalfields || options.element.name), function (i, fieldName) {
            var paramName = appendModelPrefix(fieldName, prefix);
            value.data[paramName] = function () {
                var field = $(options.form).find(":input").filter("[name='" + escapeAttributeValue(paramName) + "']");
                // For checkboxes and radio buttons, only pick up values from checked fields.
                if (field.is(":checkbox")) {
                    return field.filter(":checked").val() || field.filter(":hidden").val() || '';
                }
                else if (field.is(":radio")) {
                    return field.filter(":checked").val() || '';
                }
                return field.val();
            };
        });

        setValidationValues(options, "remote", value);
    });
    adapters.add("password", ["min", "nonalphamin", "regex"], function (options) {
        if (options.params.min) {
            setValidationValues(options, "minlength", options.params.min);
        }
        if (options.params.nonalphamin) {
            setValidationValues(options, "nonalphamin", options.params.nonalphamin);
        }
        if (options.params.regex) {
            setValidationValues(options, "regex", options.params.regex);
        }
    });

    $(function () {
        $jQval.unobtrusive.parse(document);
    });
}(jQuery));
// SIG // Begin signature block
// SIG // MIIdkAYJKoZIhvcNAQcCoIIdgTCCHX0CAQExCzAJBgUr
// SIG // DgMCGgUAMGcGCisGAQQBgjcCAQSgWTBXMDIGCisGAQQB
// SIG // gjcCAR4wJAIBAQQQEODJBs441BGiowAQS9NQkAIBAAIB
// SIG // AAIBAAIBAAIBADAhMAkGBSsOAwIaBQAEFERK7HKPGs4A
// SIG // c8SDSgXz8oOWoM19oIIYUjCCBMEwggOpoAMCAQICEzMA
// SIG // AADCoAnFN3bp9s0AAAAAAMIwDQYJKoZIhvcNAQEFBQAw
// SIG // dzELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEhMB8GA1UEAxMYTWlj
// SIG // cm9zb2Z0IFRpbWUtU3RhbXAgUENBMB4XDTE2MDkwNzE3
// SIG // NTg1MVoXDTE4MDkwNzE3NTg1MVowgbExCzAJBgNVBAYT
// SIG // AlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAwDgYDVQQH
// SIG // EwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3NvZnQgQ29y
// SIG // cG9yYXRpb24xDDAKBgNVBAsTA0FPQzEmMCQGA1UECxMd
// SIG // VGhhbGVzIFRTUyBFU046QzNCMC0wRjZBLTQxMTExJTAj
// SIG // BgNVBAMTHE1pY3Jvc29mdCBUaW1lLVN0YW1wIFNlcnZp
// SIG // Y2UwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIB
// SIG // AQCc3z0+YE+WC4Be9vCKb/5DEptBUbWZjDFzHQwa1jPi
// SIG // zjm6zQCEwQNMNfOcOKnHEzs1yILBZTsr78hnyIx/uMy3
// SIG // pH6S/FOw7nHMg1XUty4O9IWAQhCZZdEsAIX6R0dQ+DUG
// SIG // niEZ4Z5UbklMMuy6jsQhOiH/dHR9PjmlZcYih8O0eUYH
// SIG // judJteQRyPur/VEu9CGfCRakZHy6ZOdm4SzX56LLFvgh
// SIG // 7wBT1UNLk4TDmqBEpybJm2p9EGhMWb37ca3k689kEHFc
// SIG // O+GNvQmG2UVEyMuMyKbjP4uaAS4/ZsH/QqIAtK0Im8Fn
// SIG // xLz8ohbjmf53A1+SPClR2uGNS6BUKmFpPxBJAgMBAAGj
// SIG // ggEJMIIBBTAdBgNVHQ4EFgQU4x552PzIYCwRGZgSbaGw
// SIG // bo3OnawwHwYDVR0jBBgwFoAUIzT42VJGcArtQPt2+7Mr
// SIG // sMM1sw8wVAYDVR0fBE0wSzBJoEegRYZDaHR0cDovL2Ny
// SIG // bC5taWNyb3NvZnQuY29tL3BraS9jcmwvcHJvZHVjdHMv
// SIG // TWljcm9zb2Z0VGltZVN0YW1wUENBLmNybDBYBggrBgEF
// SIG // BQcBAQRMMEowSAYIKwYBBQUHMAKGPGh0dHA6Ly93d3cu
// SIG // bWljcm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljcm9zb2Z0
// SIG // VGltZVN0YW1wUENBLmNydDATBgNVHSUEDDAKBggrBgEF
// SIG // BQcDCDANBgkqhkiG9w0BAQUFAAOCAQEAKDRUa7AP/m3b
// SIG // vCCbyqMXK8tLyD8NKs61Mmu7nfTKyf6afRDtNTha16mx
// SIG // X7j1tJ4qmbe4WK7O288EpZmwSLQpCJr9Bgi0v93H9FZf
// SIG // 3NDcVKZ/E1I6KPqsJzxd6kRlM3MKyP915fRH6A5XPI1n
// SIG // dn+Raq43kHZpHTlJrcUp1bdZG1vhZ45cpdavGlqZF14D
// SIG // awQ9vYl0FewZJbL7c0lSwd9lE2agA5v8s6jwvqLFjdnh
// SIG // xA9p2oNcNOdW6vvuT3NpgP1GyXqr/ifVYUMMkxqBXQox
// SIG // PcoH3e2gEj7MYgLEQbDUZcpRTI3jwJxWciND9KzPgltP
// SIG // UOuNUhCiCm0+k9cMPvAciTCCBgAwggPooAMCAQICEzMA
// SIG // AADDDpun2LLc9ywAAAAAAMMwDQYJKoZIhvcNAQELBQAw
// SIG // fjELMAkGA1UEBhMCVVMxEzARBgNVBAgTCldhc2hpbmd0
// SIG // b24xEDAOBgNVBAcTB1JlZG1vbmQxHjAcBgNVBAoTFU1p
// SIG // Y3Jvc29mdCBDb3Jwb3JhdGlvbjEoMCYGA1UEAxMfTWlj
// SIG // cm9zb2Z0IENvZGUgU2lnbmluZyBQQ0EgMjAxMTAeFw0x
// SIG // NzA4MTEyMDIwMjRaFw0xODA4MTEyMDIwMjRaMHQxCzAJ
// SIG // BgNVBAYTAlVTMRMwEQYDVQQIEwpXYXNoaW5ndG9uMRAw
// SIG // DgYDVQQHEwdSZWRtb25kMR4wHAYDVQQKExVNaWNyb3Nv
// SIG // ZnQgQ29ycG9yYXRpb24xHjAcBgNVBAMTFU1pY3Jvc29m
// SIG // dCBDb3Jwb3JhdGlvbjCCASIwDQYJKoZIhvcNAQEBBQAD
// SIG // ggEPADCCAQoCggEBALtX1zjRsQZ/SS2pbbNjn3q6tjoh
// SIG // W7SYro3UpIGgxXXFLO+CQCq3gVN382MBCrzON4QDQENX
// SIG // gkvO7R+2/YBtycKRXQXH3FZZAOEM61fe/fG4kCe/dUr8
// SIG // dbJyWLbFSJszYgXRlZSlvzkirY0STUZi2jIZzqoiXFZI
// SIG // sW9FyWd2Yl0wiKMvKMUfUCrZhtsaESWBwvT1Zy7neR31
// SIG // 4hx19E7Mx/znvwuARyn/z81psQwLYOtn5oQbm039bUc6
// SIG // x9nBYWHylRKhDQeuYyHY9Jkc/3hVge6leegggl8K2rVT
// SIG // GVQBVw2HkY3CfPFUhoDhYtuCcz4mXvBAEtI51SYDDYWI
// SIG // MV8KC4sCAwEAAaOCAX8wggF7MB8GA1UdJQQYMBYGCisG
// SIG // AQQBgjdMCAEGCCsGAQUFBwMDMB0GA1UdDgQWBBSnE10f
// SIG // IYlV6APunhc26vJUiDUZrzBRBgNVHREESjBIpEYwRDEM
// SIG // MAoGA1UECxMDQU9DMTQwMgYDVQQFEysyMzAwMTIrYzgw
// SIG // NGI1ZWEtNDliNC00MjM4LTgzNjItZDg1MWZhMjI1NGZj
// SIG // MB8GA1UdIwQYMBaAFEhuZOVQBdOCqhc3NyK1bajKdQKV
// SIG // MFQGA1UdHwRNMEswSaBHoEWGQ2h0dHA6Ly93d3cubWlj
// SIG // cm9zb2Z0LmNvbS9wa2lvcHMvY3JsL01pY0NvZFNpZ1BD
// SIG // QTIwMTFfMjAxMS0wNy0wOC5jcmwwYQYIKwYBBQUHAQEE
// SIG // VTBTMFEGCCsGAQUFBzAChkVodHRwOi8vd3d3Lm1pY3Jv
// SIG // c29mdC5jb20vcGtpb3BzL2NlcnRzL01pY0NvZFNpZ1BD
// SIG // QTIwMTFfMjAxMS0wNy0wOC5jcnQwDAYDVR0TAQH/BAIw
// SIG // ADANBgkqhkiG9w0BAQsFAAOCAgEATZdPNH7xcJOc49Ua
// SIG // S5wRfmsmxKUk9N9E1CS6s2oIiZmayzHncJv/FB2wBzl/
// SIG // 5DA7EyLeDsiVZ7tufvh8laSQgjeTpoPTSQLBrK1Z75G3
// SIG // p2YADqJMJdTc510HAsooNGU7OYOtlSqOyqDoCDoc/j57
// SIG // QEmUTY5UJQrlsccK7nE3xpteNvWnQkT7vIewDcA12SaH
// SIG // X/9n7yh094owBBGKZ8xLNWBqIefDjQeDXpurnXEfKSYJ
// SIG // EdT1gtPSNgcpruiSbZB/AMmoW+7QBGX7oQ5XU8zymInz
// SIG // nxWTyAbEY1JhAk9XSBz1+3USyrX59MJpX7uhnQ1pgyfr
// SIG // gz4dazHD7g7xxIRDh+4xnAYAMny3IIq5CCPqVrAY1LK9
// SIG // Few37WTTaxUCI8aKM4c60Zu2wJZZLKABU4QBX/J7wXqw
// SIG // 7NTYUvZfdYFEWRY4J1O7UPNecd/311HcMdUaYzUql36f
// SIG // Zjdfz1Uz77LKvCwjqkQe7vtnSLToQsMPilFYokYCYSZa
// SIG // Gb9clOmoQHDnWzBMfIDUUGeipe4O6z218eV5HuH1WBlv
// SIG // u4lteOIgWCX/5Eiz5q/xskAEF0ZQ1AxskRR97sri9ibe
// SIG // GzsEZ1EuD6QX90L/P5GJMfinvLPlOlLcKjN/SmSRZdhl
// SIG // Ebbbare0bFL8v4txFsQsznOaoOldCMFFRaUphuwBMW1e
// SIG // dMZWMQswggYHMIID76ADAgECAgphFmg0AAAAAAAcMA0G
// SIG // CSqGSIb3DQEBBQUAMF8xEzARBgoJkiaJk/IsZAEZFgNj
// SIG // b20xGTAXBgoJkiaJk/IsZAEZFgltaWNyb3NvZnQxLTAr
// SIG // BgNVBAMTJE1pY3Jvc29mdCBSb290IENlcnRpZmljYXRl
// SIG // IEF1dGhvcml0eTAeFw0wNzA0MDMxMjUzMDlaFw0yMTA0
// SIG // MDMxMzAzMDlaMHcxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xITAf
// SIG // BgNVBAMTGE1pY3Jvc29mdCBUaW1lLVN0YW1wIFBDQTCC
// SIG // ASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJ+h
// SIG // bLHf20iSKnxrLhnhveLjxZlRI1Ctzt0YTiQP7tGn0Uyt
// SIG // dDAgEesH1VSVFUmUG0KSrphcMCbaAGvoe73siQcP9w4E
// SIG // mPCJzB/LMySHnfL0Zxws/HvniB3q506jocEjU8qN+kXP
// SIG // CdBer9CwQgSi+aZsk2fXKNxGU7CG0OUoRi4nrIZPVVIM
// SIG // 5AMs+2qQkDBuh/NZMJ36ftaXs+ghl3740hPzCLdTbVK0
// SIG // RZCfSABKR2YRJylmqJfk0waBSqL5hKcRRxQJgp+E7VV4
// SIG // /gGaHVAIhQAQMEbtt94jRrvELVSfrx54QTF3zJvfO4OT
// SIG // oWECtR0Nsfz3m7IBziJLVP/5BcPCIAsCAwEAAaOCAasw
// SIG // ggGnMA8GA1UdEwEB/wQFMAMBAf8wHQYDVR0OBBYEFCM0
// SIG // +NlSRnAK7UD7dvuzK7DDNbMPMAsGA1UdDwQEAwIBhjAQ
// SIG // BgkrBgEEAYI3FQEEAwIBADCBmAYDVR0jBIGQMIGNgBQO
// SIG // rIJgQFYnl+UlE/wq4QpTlVnkpKFjpGEwXzETMBEGCgmS
// SIG // JomT8ixkARkWA2NvbTEZMBcGCgmSJomT8ixkARkWCW1p
// SIG // Y3Jvc29mdDEtMCsGA1UEAxMkTWljcm9zb2Z0IFJvb3Qg
// SIG // Q2VydGlmaWNhdGUgQXV0aG9yaXR5ghB5rRahSqClrUxz
// SIG // WPQHEy5lMFAGA1UdHwRJMEcwRaBDoEGGP2h0dHA6Ly9j
// SIG // cmwubWljcm9zb2Z0LmNvbS9wa2kvY3JsL3Byb2R1Y3Rz
// SIG // L21pY3Jvc29mdHJvb3RjZXJ0LmNybDBUBggrBgEFBQcB
// SIG // AQRIMEYwRAYIKwYBBQUHMAKGOGh0dHA6Ly93d3cubWlj
// SIG // cm9zb2Z0LmNvbS9wa2kvY2VydHMvTWljcm9zb2Z0Um9v
// SIG // dENlcnQuY3J0MBMGA1UdJQQMMAoGCCsGAQUFBwMIMA0G
// SIG // CSqGSIb3DQEBBQUAA4ICAQAQl4rDXANENt3ptK132855
// SIG // UU0BsS50cVttDBOrzr57j7gu1BKijG1iuFcCy04gE1CZ
// SIG // 3XpA4le7r1iaHOEdAYasu3jyi9DsOwHu4r6PCgXIjUji
// SIG // 8FMV3U+rkuTnjWrVgMHmlPIGL4UD6ZEqJCJw+/b85HiZ
// SIG // Lg33B+JwvBhOnY5rCnKVuKE5nGctxVEO6mJcPxaYiyA/
// SIG // 4gcaMvnMMUp2MT0rcgvI6nA9/4UKE9/CCmGO8Ne4F+tO
// SIG // i3/FNSteo7/rvH0LQnvUU3Ih7jDKu3hlXFsBFwoUDtLa
// SIG // FJj1PLlmWLMtL+f5hYbMUVbonXCUbKw5TNT2eb+qGHpi
// SIG // Ke+imyk0BncaYsk9Hm0fgvALxyy7z0Oz5fnsfbXjpKh0
// SIG // NbhOxXEjEiZ2CzxSjHFaRkMUvLOzsE1nyJ9C/4B5IYCe
// SIG // FTBm6EISXhrIniIh0EPpK+m79EjMLNTYMoBMJipIJF9a
// SIG // 6lbvpt6Znco6b72BJ3QGEe52Ib+bgsEnVLaxaj2JoXZh
// SIG // tG6hE6a/qkfwEm/9ijJssv7fUciMI8lmvZ0dhxJkAj0t
// SIG // r1mPuOQh5bWwymO0eFQF1EEuUKyUsKV4q7OglnUa2ZKH
// SIG // E3UiLzKoCG6gW4wlv6DvhMoh1useT8ma7kng9wFlb4kL
// SIG // fchpyOZu6qeXzjEp/w7FW1zYTRuh2Povnj8uVRZryROj
// SIG // /TCCB3owggVioAMCAQICCmEOkNIAAAAAAAMwDQYJKoZI
// SIG // hvcNAQELBQAwgYgxCzAJBgNVBAYTAlVTMRMwEQYDVQQI
// SIG // EwpXYXNoaW5ndG9uMRAwDgYDVQQHEwdSZWRtb25kMR4w
// SIG // HAYDVQQKExVNaWNyb3NvZnQgQ29ycG9yYXRpb24xMjAw
// SIG // BgNVBAMTKU1pY3Jvc29mdCBSb290IENlcnRpZmljYXRl
// SIG // IEF1dGhvcml0eSAyMDExMB4XDTExMDcwODIwNTkwOVoX
// SIG // DTI2MDcwODIxMDkwOVowfjELMAkGA1UEBhMCVVMxEzAR
// SIG // BgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcTB1JlZG1v
// SIG // bmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jwb3JhdGlv
// SIG // bjEoMCYGA1UEAxMfTWljcm9zb2Z0IENvZGUgU2lnbmlu
// SIG // ZyBQQ0EgMjAxMTCCAiIwDQYJKoZIhvcNAQEBBQADggIP
// SIG // ADCCAgoCggIBAKvw+nIQHC6t2G6qghBNNLrytlghn0Ib
// SIG // KmvpWlCquAY4GgRJun/DDB7dN2vGEtgL8DjCmQawyDnV
// SIG // ARQxQtOJDXlkh36UYCRsr55JnOloXtLfm1OyCizDr9mp
// SIG // K656Ca/XllnKYBoF6WZ26DJSJhIv56sIUM+zRLdd2MQu
// SIG // A3WraPPLbfM6XKEW9Ea64DhkrG5kNXimoGMPLdNAk/jj
// SIG // 3gcN1Vx5pUkp5w2+oBN3vpQ97/vjK1oQH01WKKJ6cuAS
// SIG // OrdJXtjt7UORg9l7snuGG9k+sYxd6IlPhBryoS9Z5JA7
// SIG // La4zWMW3Pv4y07MDPbGyr5I4ftKdgCz1TlaRITUlwzlu
// SIG // ZH9TupwPrRkjhMv0ugOGjfdf8NBSv4yUh7zAIXQlXxgo
// SIG // tswnKDglmDlKNs98sZKuHCOnqWbsYR9q4ShJnV+I4iVd
// SIG // 0yFLPlLEtVc/JAPw0XpbL9Uj43BdD1FGd7P4AOG8rAKC
// SIG // X9vAFbO9G9RVS+c5oQ/pI0m8GLhEfEXkwcNyeuBy5yTf
// SIG // v0aZxe/CHFfbg43sTUkwp6uO3+xbn6/83bBm4sGXgXvt
// SIG // 1u1L50kppxMopqd9Z4DmimJ4X7IvhNdXnFy/dygo8e1t
// SIG // wyiPLI9AN0/B4YVEicQJTMXUpUMvdJX3bvh4IFgsE11g
// SIG // lZo+TzOE2rCIF96eTvSWsLxGoGyY0uDWiIwLAgMBAAGj
// SIG // ggHtMIIB6TAQBgkrBgEEAYI3FQEEAwIBADAdBgNVHQ4E
// SIG // FgQUSG5k5VAF04KqFzc3IrVtqMp1ApUwGQYJKwYBBAGC
// SIG // NxQCBAweCgBTAHUAYgBDAEEwCwYDVR0PBAQDAgGGMA8G
// SIG // A1UdEwEB/wQFMAMBAf8wHwYDVR0jBBgwFoAUci06AjGQ
// SIG // Q7kUBU7h6qfHMdEjiTQwWgYDVR0fBFMwUTBPoE2gS4ZJ
// SIG // aHR0cDovL2NybC5taWNyb3NvZnQuY29tL3BraS9jcmwv
// SIG // cHJvZHVjdHMvTWljUm9vQ2VyQXV0MjAxMV8yMDExXzAz
// SIG // XzIyLmNybDBeBggrBgEFBQcBAQRSMFAwTgYIKwYBBQUH
// SIG // MAKGQmh0dHA6Ly93d3cubWljcm9zb2Z0LmNvbS9wa2kv
// SIG // Y2VydHMvTWljUm9vQ2VyQXV0MjAxMV8yMDExXzAzXzIy
// SIG // LmNydDCBnwYDVR0gBIGXMIGUMIGRBgkrBgEEAYI3LgMw
// SIG // gYMwPwYIKwYBBQUHAgEWM2h0dHA6Ly93d3cubWljcm9z
// SIG // b2Z0LmNvbS9wa2lvcHMvZG9jcy9wcmltYXJ5Y3BzLmh0
// SIG // bTBABggrBgEFBQcCAjA0HjIgHQBMAGUAZwBhAGwAXwBw
// SIG // AG8AbABpAGMAeQBfAHMAdABhAHQAZQBtAGUAbgB0AC4g
// SIG // HTANBgkqhkiG9w0BAQsFAAOCAgEAZ/KGpZjgVHkaLtPY
// SIG // dGcimwuWEeFjkplCln3SeQyQwWVfLiw++MNy0W2D/r4/
// SIG // 6ArKO79HqaPzadtjvyI1pZddZYSQfYtGUFXYDJJ80hpL
// SIG // HPM8QotS0LD9a+M+By4pm+Y9G6XUtR13lDni6WTJRD14
// SIG // eiPzE32mkHSDjfTLJgJGKsKKELukqQUMm+1o+mgulaAq
// SIG // PyprWEljHwlpblqYluSD9MCP80Yr3vw70L01724lruWv
// SIG // J+3Q3fMOr5kol5hNDj0L8giJ1h/DMhji8MUtzluetEk5
// SIG // CsYKwsatruWy2dsViFFFWDgycScaf7H0J/jeLDogaZiy
// SIG // WYlobm+nt3TDQAUGpgEqKD6CPxNNZgvAs0314Y9/HG8V
// SIG // fUWnduVAKmWjw11SYobDHWM2l4bf2vP48hahmifhzaWX
// SIG // 0O5dY0HjWwechz4GdwbRBrF1HxS+YWG18NzGGwS+30HH
// SIG // Diju3mUv7Jf2oVyW2ADWoUa9WfOXpQlLSBCZgB/QACnF
// SIG // sZulP0V3HjXG0qKin3p6IvpIlR+r+0cjgPWe+L9rt0uX
// SIG // 4ut1eBrs6jeZeRhL/9azI2h15q/6/IvrC4DqaTuv/DDt
// SIG // BEyO3991bWORPdGdVk5Pv4BXIqF4ETIheu9BCrE/+6jM
// SIG // pF3BoYibV3FWTkhFwELJm3ZbCoBIa/15n8G9bW1qyVJz
// SIG // Ew16UM0xggSqMIIEpgIBATCBlTB+MQswCQYDVQQGEwJV
// SIG // UzETMBEGA1UECBMKV2FzaGluZ3RvbjEQMA4GA1UEBxMH
// SIG // UmVkbW9uZDEeMBwGA1UEChMVTWljcm9zb2Z0IENvcnBv
// SIG // cmF0aW9uMSgwJgYDVQQDEx9NaWNyb3NvZnQgQ29kZSBT
// SIG // aWduaW5nIFBDQSAyMDExAhMzAAAAww6bp9iy3PcsAAAA
// SIG // AADDMAkGBSsOAwIaBQCggb4wGQYJKoZIhvcNAQkDMQwG
// SIG // CisGAQQBgjcCAQQwHAYKKwYBBAGCNwIBCzEOMAwGCisG
// SIG // AQQBgjcCARUwIwYJKoZIhvcNAQkEMRYEFFQ3+WlZmPVF
// SIG // oKxpOHL+cJwfLIoeMF4GCisGAQQBgjcCAQwxUDBOoCaA
// SIG // JABNAGkAYwByAG8AcwBvAGYAdAAgAEwAZQBhAHIAbgBp
// SIG // AG4AZ6EkgCJodHRwOi8vd3d3Lm1pY3Jvc29mdC5jb20v
// SIG // bGVhcm5pbmcgMA0GCSqGSIb3DQEBAQUABIIBAKSri05W
// SIG // M/qzMV7Cc3od8Ey2J92ILCUHQxYJ3NNPiZBNz+r6D2en
// SIG // TFJ6sPVH5mx+PUxwDJAkmgxlY5hTIBnd2tkEpdsiENbT
// SIG // KqdhIQogF3kuAt6RY0h01kyHawat3I1XYDsTMFIgYW+t
// SIG // nv9dTl89qdLr8S//Mg3VrBq0xXpdxTV7bAsRw1KpL9iw
// SIG // EGQp9+DLoQnKbUYC9TzttpcA6lC9PZTwJ2oQm4Fha7Am
// SIG // 6DDCLq32oHKgt7RFSZE/d3Bjn35qSDBwkL/XFCTbBIXP
// SIG // wQr6BDeE4Xb0JhTXn2Ls5X1TaoXDTIjHJAcjQ5qim3J5
// SIG // 1ut0WWyT4/Zwcch9DVBY/3YddMGhggIoMIICJAYJKoZI
// SIG // hvcNAQkGMYICFTCCAhECAQEwgY4wdzELMAkGA1UEBhMC
// SIG // VVMxEzARBgNVBAgTCldhc2hpbmd0b24xEDAOBgNVBAcT
// SIG // B1JlZG1vbmQxHjAcBgNVBAoTFU1pY3Jvc29mdCBDb3Jw
// SIG // b3JhdGlvbjEhMB8GA1UEAxMYTWljcm9zb2Z0IFRpbWUt
// SIG // U3RhbXAgUENBAhMzAAAAwqAJxTd26fbNAAAAAADCMAkG
// SIG // BSsOAwIaBQCgXTAYBgkqhkiG9w0BCQMxCwYJKoZIhvcN
// SIG // AQcBMBwGCSqGSIb3DQEJBTEPFw0xNzEyMjkwNjEyMzla
// SIG // MCMGCSqGSIb3DQEJBDEWBBQEsFNW9cRgWO07v2+hRDVd
// SIG // swMSRzANBgkqhkiG9w0BAQUFAASCAQA95t+OBU6sZR4d
// SIG // RCFjk+4AkrQ72FgIkcRjydkx0/PSOd1hH4jp/kQ3UYg7
// SIG // JtxjZIYH5/aNolpEL81o9gc0q7KW5EOd1uJdAoXTjCDt
// SIG // GM2JpLqWavJy0BH+nGzADehASXBHOyhL+vBJR02XdT08
// SIG // m0DeMY71hfIrn/1aAu2ggyZDuG9l+eMlLdx6MX5FMXLT
// SIG // 3YhqLqGIttyZNiHpkfA01aMgkirLuaPUiZ7rsh0y5yAL
// SIG // JenqZTFchyDXGl1zB91YLk2YGXOhnj75sRjf8qnxAePb
// SIG // j1QhdfbYr4R5OYDDgB+g4dc9wHH52a/a5KUh0dRRFcP+
// SIG // ysyzjH2P2/y+3YYsZj9Q
// SIG // End signature block
