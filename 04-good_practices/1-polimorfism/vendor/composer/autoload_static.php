<?php

// autoload_static.php @generated by Composer

namespace Composer\Autoload;

class ComposerStaticInitdbcb7fe020a64196e721b0d8cb86349e
{
    public static $prefixLengthsPsr4 = array (
        'C' => 
        array (
            'CodelyTv\\' => 9,
        ),
    );

    public static $prefixDirsPsr4 = array (
        'CodelyTv\\' => 
        array (
            0 => __DIR__ . '/../..' . '/src',
        ),
    );

    public static $classMap = array (
        'Composer\\InstalledVersions' => __DIR__ . '/..' . '/composer/InstalledVersions.php',
    );

    public static function getInitializer(ClassLoader $loader)
    {
        return \Closure::bind(function () use ($loader) {
            $loader->prefixLengthsPsr4 = ComposerStaticInitdbcb7fe020a64196e721b0d8cb86349e::$prefixLengthsPsr4;
            $loader->prefixDirsPsr4 = ComposerStaticInitdbcb7fe020a64196e721b0d8cb86349e::$prefixDirsPsr4;
            $loader->classMap = ComposerStaticInitdbcb7fe020a64196e721b0d8cb86349e::$classMap;

        }, null, ClassLoader::class);
    }
}
