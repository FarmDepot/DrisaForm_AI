<?php
/**
 * Plugin Name:       DrisaForm AI Chatbot
 * Plugin URI:        https://farmdepot.ng
 * Description:       Integrates the DrisaForm AI assistant for FarmDepot.ng.
 * Version:           1.2.0
 * Author:            Drisa Infotech
 * Author URI:        https://drisatech.com
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       drisaform-chatbot
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

/**
 * Enqueue scripts and styles.
 */
function drisaform_enqueue_scripts() {
    // Enqueue the main plugin script.
    wp_enqueue_script(
        'drisaform-plugin-script',
        plugin_dir_url( __FILE__ ) . 'js/drisaform-plugin.js',
        array(),
        '1.2.0', // Updated version number
        true
    );

    // --- NEW: Localize Script ---
    // This passes data from PHP to our JavaScript file.
    // It's the best practice for passing dynamic data like URLs.
    $language_files = array(
        'en' => plugin_dir_url( __FILE__ ) . 'languages/en.json',
        'ha' => plugin_dir_url( __FILE__ ) . 'languages/ha.json',
        'ig' => plugin_dir_url( __FILE__ ) . 'languages/ig.json',
        'yo' => plugin_dir_url( __FILE__ ) . 'languages/yo.json',
    );

    wp_localize_script(
        'drisaform-plugin-script', // The handle of the script to attach data to.
        'drisaform_params',        // The name of the JavaScript object that will contain our data.
        array(
            'languageFiles' => $language_files, // The data itself.
            'backendUrl' => 'https://drisaform-ai.onrender.com/chat' // Add this line
        )
    );
}

// Add the function to the 'wp_enqueue_scripts' action hook.
add_action( 'wp_enqueue_scripts', 'drisaform_enqueue_scripts' );
