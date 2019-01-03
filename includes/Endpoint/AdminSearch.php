<?php

namespace Pangolin\WPR\Endpoint;
use Pangolin\WPR;

/**
 * @subpackage REST_Controller
 */
class AdminSearch {
    /**
	 * Instance of this class.
	 *
	 * @since    0.8.1
	 *
	 * @var      object
	 */
	protected static $instance = null;

	/**
	 * Initialize the plugin by setting localization and loading public scripts
	 * and styles.
	 *
	 * @since     0.8.1
	 */
	private function __construct() {
        $plugin = WPR\Plugin::get_instance();
		$this->plugin_slug = $plugin->get_plugin_slug();
	}

    /**
     * Set up WordPress hooks and filters
     *
     * @return void
     */
    public function do_hooks() {
        add_action( 'rest_api_init', array( $this, 'register_routes' ) );
    }

	/**
	 * Return an instance of this class.
	 *
	 * @since     0.8.1
	 *
	 * @return    object    A single instance of this class.
	 */
	public static function get_instance() {

		// If the single instance hasn't been set, set it now.
		if ( null == self::$instance ) {
			self::$instance = new self;
			self::$instance->do_hooks();
		}

		return self::$instance;
	}

    /**
     * Register the routes for the objects of the controller.
     */
    public function register_routes() {
        $version = '1';
        $namespace = $this->plugin_slug . '/v' . $version;
        $endpoint = "/adminSearch/";

        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::READABLE,
                'callback'              => array( $this, 'get_uneek_search' ),
                'args'                  => array(),
            ),
        ) );

        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::CREATABLE,
                'callback'              => array( $this, 'update_uneek_search' ),
                'permission_callback'   => array( $this, 'admin_permissions_check' ),
                'args'                  => array(
                    'search' => array(
                        'required' => true, // means that this parameter must be passed (whatever its value) in order for the request to succeed
                        'type' => 'bool',
                        'description' => 'If enabled, gives visitors a search bar which they can use to refine the post list.',
                        'format' => 'text', // we set the format in order to take advantage of built-in email field validation
                        'validate_callback' => function( $param, $request, $key ) { return ! empty( $param ); } // prevent submission of empty field
                    )
                ),
            ),
        ) );

        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::EDITABLE,
                'callback'              => array( $this, 'update_uneek_search' ),
                'permission_callback'   => array( $this, 'admin_permissions_check' ),
                'args'                  => array(
                    'search' => array(
                        'required' => true, // means that this parameter must be passed (whatever its value) in order for the request to succeed
                        'type' => 'bool',
                        'description' => 'Desired search (Appears above the rendered projects).',
                        'format' => 'text', // we set the format in order to take advantage of built-in email field validation
                        'validate_callback' => function( $param, $request, $key ) { return ! empty( $param ); } // prevent submission of empty field
                    )
                ),
            ),
        ) );

        register_rest_route( $namespace, $endpoint, array(
            array(
                'methods'               => \WP_REST_Server::DELETABLE,
                'callback'              => array( $this, 'delete_uneek_search' ),
                'permission_callback'   => array( $this, 'admin_permissions_check' ),
                'args'                  => array(),
            ),
        ) );
    }

    /**
     * Get search
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function get_uneek_search( $request ) {
        $uneeksearch = get_option( 'uneek-search' );

        // Don't return false if there is no option
        if ( ! $uneeksearch ) {
            return new \WP_REST_Response( array(
                'success' => true,
                'value' => ''
            ), 200 );
        }

        return new \WP_REST_Response( array(
            'success' => true,
            'value' => $uneeksearch
        ), 200 );
    }

    /**
     * Create OR Update search
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function update_uneek_search( $request ) {
        $updated = update_option( 'uneek-search', $request->get_param( 'search' ) );

        return new \WP_REST_Response( array(
            'success'   => $updated,
            'value'     => $request->get_param( 'search' )
        ), 200 );
    }

    /**
     * Delete search
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|WP_REST_Request
     */
    public function delete_uneek_search( $request ) {
        $deleted = delete_option( 'uneek-search' );

        return new \WP_REST_Response( array(
            'success'   => $deleted,
            'value'     => ''
        ), 200 );
    }

    /**
     * Check if a given request has access to update a setting
     *
     * @param WP_REST_Request $request Full data about the request.
     * @return WP_Error|bool
     */
    public function admin_permissions_check( $request ) {
        return current_user_can( 'manage_options' );
    }
}