
jQuery(function() {
    var $form = jQuery('#reused_form');
    var $submitButton = $form.find('button[type="submit"]');
    var submitLabel = $submitButton.text();

    function showError(message, errors) {
        var $errorMessage = jQuery('#error_message');
        var $errorList = jQuery('<ul>');

        jQuery.each(errors || {}, function(key, value) {
            $errorList.append(jQuery('<li>').text(key + ': ' + value));
        });

        $errorMessage.find('ul').remove();
        $errorMessage.append($errorList).prepend(document.createTextNode(message));
        jQuery('#success_message').hide();
        $errorMessage.show();
    }

    $form.on('submit', function(event) {
        event.preventDefault();
        $submitButton.prop('disabled', true).text('Sending...');
        jQuery('#error_message').hide().empty();

        jQuery.ajax({
            type: 'POST',
            url: 'assets/phpmailer/handler.php',
            data: $form.serialize(),
            dataType: 'json'
        }).done(function(data) {
            if (data && data.result === 'success') {
                $form.hide();
                jQuery('#success_message').show();
                return;
            }

            if (data && data.result === 'validation_failed') {
                showError('Please check your message and try again.', data.errors);
            } else {
                showError('We could not send your message. Please try again or email info@eskimo.com.', {});
            }
            $submitButton.prop('disabled', false).text(submitLabel);
        }).fail(function() {
            showError('We could not send your message. Please try again or email info@eskimo.com.', {});
            $submitButton.prop('disabled', false).text(submitLabel);
        });
    });
});
