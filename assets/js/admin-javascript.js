/**
 * Admin js file.
 *
 * @package GTM_Server_Side
 */

jQuery( document ).ready(
	function () {
		// Validate.
		var formGtmServerSide = jQuery( '.js-form-gtm-server-side' ).validate(
			{
				rules: {
					gtm_server_side_web_container_id: {
						webContainerId: true
					},
					gtm_server_side_web_container_url: {
						webContainerUrl: true
					},
					gtm_server_side_webhooks_container_url: {
						required: true,
						url: true,
						webhooksContainerUrl: true,
					},
				}
			}
		);

		// Add validate rules.
		jQuery.validator.addMethod(
			'webContainerId',
			function( value, element ) {
				if ( ! value ) {
					return true;
				}
				return value && /^GTM-.+$/.test( value );
			},
			'Container id must be in GTM-XXXXXX format'
		);
		jQuery.validator.addMethod(
			'webContainerUrl',
			function( value, element ) {
				if ( ! value ) {
					return true;
				}
				return /^https:\/\/[\w\-\.]+$/.test( value );
			},
			'URL must be entered with https:// and without slashes at the end'
		);
		jQuery.validator.addMethod(
			'webhooksContainerUrl',
			function( value, element ) {
				if ( ! value ) {
					return true;
				}

				var isPurchaseChecked = jQuery( '#gtm_server_side_webhooks_purchase' ).is( ':checked' );
				var isRefundChecked   = jQuery( '#gtm_server_side_webhooks_refund' ).is( ':checked' );

				return isPurchaseChecked || isRefundChecked;
			},
			'Select purchase and/or refund webhook'
		);

		// Tab "General".
		pluginGtmServerSide.changeContainerId();
		jQuery( '.js-gtm_server_side_placement' ).on(
			'click',
			function() {
				pluginGtmServerSide.changeContainerId();
			}
		);
		pluginGtmServerSide.changeWebIdentifier();
		jQuery( '.js-gtm_server_side_web_identifier' ).on(
			'keyup',
			function() {
				pluginGtmServerSide.changeWebIdentifier();
			}
		);
		// ----------

		// Tab "Data Layer".
		pluginGtmServerSide.initTabDataLayer();
		jQuery( '#gtm_server_side_data_layer_ecommerce' ).click(
			function() {
				pluginGtmServerSide.initTabDataLayer();
			}
		);
		// ----------

		// Tab "Webhooks".
		pluginGtmServerSide.initTabWebhooks();
		jQuery( '#gtm_server_side_webhooks_enable' ).click(
			function() {
				pluginGtmServerSide.initTabWebhooks();
			}
		);

		jQuery( '.js-send-test-webhooks' ).on(
			'click',
			function( e ){
				e.preventDefault();

				formGtmServerSide.element( "#gtm_server_side_webhooks_container_url" );
				var $elMessage = jQuery( '.js-ajax-message' );
				$elMessage.html( '<i>' + $elMessage.data( 'message-loading' ) + '</i>' );

				jQuery.post(
					varGtmServerSide.ajax,
					{
						action: 'gtm_server_side_webhook_test',
						security: varGtmServerSide.security,
					},
					function ( response ) {
						if ( ! response.success ) {
							$elMessage.html( '<span class="error">' + response.data.message + '</span>' );
							return false;
						}
						$elMessage.html( '<span class="success">' + response.data.message + '</span>' );
					}
				);
			}
		);
	}
);

var pluginGtmServerSide = {
	initTabDataLayer: function() {
		var $elUserData = jQuery( '#gtm_server_side_data_layer_user_data' );
		if ( false === jQuery( '#gtm_server_side_data_layer_ecommerce' ).is( ':checked' ) ) {
			$elUserData
				.prop( 'checked', false )
				.prop( 'disabled', true );
		} else {
			$elUserData.prop( 'disabled', false );
		}
	},

	initTabWebhooks: function() {
		var $elContainerUrl = jQuery( '#gtm_server_side_webhooks_container_url' );
		var $elPurchase     = jQuery( '#gtm_server_side_webhooks_purchase' );
		var $elRefund       = jQuery( '#gtm_server_side_webhooks_refund' );
		var $btnTest        = jQuery( '.js-send-test-webhooks' );

		if ( false === jQuery( '#gtm_server_side_webhooks_enable' ).is( ':checked' ) ) {
			$elContainerUrl.prop( 'disabled', true );
			$elPurchase.prop( 'checked', false )
				.prop( 'disabled', true );
			$elRefund.prop( 'checked', false )
				.prop( 'disabled', true );
			$btnTest.prop( 'disabled', true );
		} else {
			$elContainerUrl.prop( 'disabled', false );
			$elPurchase.prop( 'disabled', false );
			$elRefund.prop( 'disabled', false );
			$btnTest.prop( 'disabled', false );
		}
	},

	changeContainerId: function() {
		var val   = jQuery( '.js-gtm_server_side_placement:checked' ).val();
		var $elCI = jQuery( '#gtm_server_side_web_container_id' );

		if ( 'code' === val || 'plugin' === val ) {
			$elCI.rules(
				'add',
				{
					required: true,
				}
			);
		} else {
			$elCI.rules( 'remove', 'required' );
		}
	},

	changeWebIdentifier: function() {
		var $elCookieKeeper = jQuery( '#gtm_server_side_cookie_keeper' );
		if ( 0 === jQuery( '#gtm_server_side_web_identifier' ).val().length ) {
			$elCookieKeeper
				.prop( 'checked', false )
				.prop( 'disabled', true );
		} else {
			$elCookieKeeper.prop( 'disabled', false );
		}
	},
};
