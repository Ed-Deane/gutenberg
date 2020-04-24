/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Button, Dropdown } from '@wordpress/components';
import { PostPreviewButton, PostSavedState } from '@wordpress/editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { useViewportMatch } from '@wordpress/compose';
import { cog } from '@wordpress/icons';
import { PinnedItems, AdminMenuToggle } from '@wordpress/interface';

/**
 * Internal dependencies
 */
import HeaderToolbar from './header-toolbar';
import MoreMenu from './more-menu';
import PostPublishButtonOrToggle from './post-publish-button-or-toggle';
import { default as DevicePreview } from '../device-preview';

function Header( { onToggleInserter, isInserterOpen } ) {
	const {
		shortcut,
		hasActiveMetaboxes,
		isEditorSidebarOpened,
		isPublishSidebarOpened,
		isSaving,
		getBlockSelectionStart,
		isFullscreenActive,
		showIconLabel,
	} = useSelect(
		( select ) => ( {
			shortcut: select(
				'core/keyboard-shortcuts'
			).getShortcutRepresentation( 'core/edit-post/toggle-sidebar' ),
			hasActiveMetaboxes: select( 'core/edit-post' ).hasMetaBoxes(),
			isEditorSidebarOpened: select(
				'core/edit-post'
			).isEditorSidebarOpened(),
			isPublishSidebarOpened: select(
				'core/edit-post'
			).isPublishSidebarOpened(),
			isSaving: select( 'core/edit-post' ).isSavingMetaBoxes(),
			getBlockSelectionStart: select( 'core/block-editor' )
				.getBlockSelectionStart,
			isPostSaveable: select( 'core/editor' ).isEditedPostSaveable(),
			isFullscreenActive: select( 'core/edit-post' ).isFeatureActive(
				'fullscreenMode'
			),
			deviceType: select(
				'core/edit-post'
			).__experimentalGetPreviewDeviceType(),
			showIconLabel: select( 'core/edit-post' ).isFeatureActive(
				'showIconLabels'
			),
		} ),
		[]
	);
	const { openGeneralSidebar, closeGeneralSidebar } = useDispatch(
		'core/edit-post'
	);

	const isLargeViewport = useViewportMatch( 'large' );

	const toggleGeneralSidebar = isEditorSidebarOpened
		? closeGeneralSidebar
		: () =>
				openGeneralSidebar(
					getBlockSelectionStart()
						? 'edit-post/block'
						: 'edit-post/document'
				);

	const headerSettings = (
		<div className="edit-post-header__settings">
			{ ! isPublishSidebarOpened && (
				// This button isn't completely hidden by the publish sidebar.
				// We can't hide the whole toolbar when the publish sidebar is open because
				// we want to prevent mounting/unmounting the PostPublishButtonOrToggle DOM node.
				// We track that DOM node to return focus to the PostPublishButtonOrToggle
				// when the publish sidebar has been closed.
				<PostSavedState
					forceIsDirty={ hasActiveMetaboxes }
					forceIsSaving={ isSaving }
				/>
			) }
			<DevicePreview />
			<PostPreviewButton
				forceIsAutosaveable={ hasActiveMetaboxes }
				forcePreviewLink={ isSaving ? null : undefined }
			/>
			<PostPublishButtonOrToggle
				forceIsDirty={ hasActiveMetaboxes }
				forceIsSaving={ isSaving }
			/>
			<Button
				icon={ cog }
				label={ __( 'Settings' ) }
				onClick={ toggleGeneralSidebar }
				isPressed={ isEditorSidebarOpened }
				aria-expanded={ isEditorSidebarOpened }
				shortcut={ shortcut }
			/>
			<PinnedItems.Slot scope="core/edit-post" />
			<MoreMenu showIconLabel={ showIconLabel } />
		</div>
	);

	return (
		<div className="edit-post-header">
			{ isFullscreenActive && <AdminMenuToggle /> }
			<div className="edit-post-header__toolbar">
				<HeaderToolbar
					onToggleInserter={ onToggleInserter }
					isInserterOpen={ isInserterOpen }
				/>
			</div>
			{ isLargeViewport && headerSettings }
			{ ! isLargeViewport && (
				<Dropdown
					className="my-container-class-name"
					contentClassName="my-popover-content-classname"
					position="bottom right"
					renderToggle={ ( { isOpen, onToggle } ) => (
						<Button
							isPrimary
							onClick={ onToggle }
							aria-expanded={ isOpen }
							icon="menu"
						/>
					) }
					renderContent={ () => headerSettings }
				/>
			) }
		</div>
	);
}

export default Header;
